
import * as es from 'elasticsearch';
import * as ts from '@terascope/job-components';
import { Matcher } from 'ts-transforms';
import _ from 'lodash';
import { CreateRecordInput, UpdateRecordInput } from 'elasticsearch-store';
import { ManagerConfig, FindOneArgs, FindArgs, AuthUser, ACLManager, UserTypes, User } from '@terascope/data-access';
import Lists, { List } from './model';
import { Notifications, TimerDict, ListDict, SubscriptionCleanup, subscriptionCb } from './interfaces';
import { validateNotifications } from './utils';

const SUPERADMIN = 'SUPERADMIN';
const USER = 'USER';
const DATAADMIN = 'DATAADMIN';

export class ListManager {
    logger: ts.Logger;
    private readonly _lists: Lists;
    private _aclManager: ACLManager;
    private _timer: TimerDict;
    private canShutdown = true;

    constructor(client: es.Client, config: ManagerConfig, aclManager: ACLManager) {
        this.logger = config.logger || ts.debugLogger('acl-manager');
        this._lists = new Lists(client, config);
        this._aclManager = aclManager;
        this._timer = {};
    }

    async initialize() {
        return Promise.all([this._lists.initialize(), this._aclManager.initialize()]);
    }

    private async _subscriptionCallIsDone() {
        if (this.canShutdown) return true;
        return new Promise((resolve) => {
            const timer = setInterval(() => {
                if (this.canShutdown) {
                    clearInterval(timer);
                    resolve(true);
                }
            });
        });
    }

    async shutdown() {
        // we cleanup subscription
        const timerValues = Object.values(this._timer);
        if (timerValues.length > 0) {
            timerValues.forEach(timer => clearInterval(timer));
        }

        return Promise.all([
            this._subscriptionCallIsDone(),
            this._lists.shutdown(),
            this._aclManager.shutdown()
        ]);
    }

    // @ts-ignore
    async findList(args: FindOneArgs<List>, authUser: AuthUser) {
        return this._lists.findByAnyId(args.id, args);
    }

    // @ts-ignore
    async findLists(args: FindArgs<List> = {}, authUser: AuthUser) {
        return this._lists.find(args.query, args);
    }

    async createList(args: { list: CreateRecordInput<List> }, authUser: AuthUser) {
        await this._validateListInput(args.list, authUser);
        return this._lists.create(args.list);
    }

    async subscribe(clientId: number, cb: subscriptionCb, time: number): Promise<SubscriptionCleanup> {
        const query = { query:`client_id:${clientId} AND active:true`, size: 10000 };
        const listState : ListDict = {};
        if (this._timer[clientId] != null) throw new ts.TSError(`You can only call subscribe once for a given client_id: ${clientId}`);

        const checkForListChanges = async() => {
            const initialList = await this.findLists(query, false);
            const changedLists = initialList.filter((list) => {
                if (listState[list.id] == null) {
                    listState[list.id] = list;
                    return true;
                }
                // a change has occured, reload
                if (listState[list.id].updated !== list.updated) {
                    listState[list.id] = list;
                    return true;
                }
                return false;
            });

            return cb(changedLists);
        };

        await checkForListChanges();

        const timer = setInterval(async () => {
            this.canShutdown = false;
            try {
                await checkForListChanges();
            } catch (err) {
                // TODO: expand this error
                this.logger.error(err, 'Could not update');
            }
            this.canShutdown = true;
        }, time);
        // we set so shutdown can cleanup if called;
        this._timer[clientId] = timer;

        return {
            unsubscribe: () => {
                clearInterval(timer);
            }
        };
    }

    async updateList(args: { list: UpdateRecordInput<List> }, authUser: AuthUser) {
         // need to validateCanUpdate
        await this._validateListInput(args.list, authUser);
        await this._lists.update(args.list);

        return this._lists.findById(args.list.id, {});
    }
    // @ts-ignore

    async removeList(args: { id: string }, authUser: AuthUser) {
        // need to validateCanRemove
        await this._lists.deleteById(args.id);
        return true;
    }

    // @ts-ignore
    async countLists(args: { query?: string } = {}, authUser: AuthUser) {
        // TODO: should restrain by listQueryAcess
        return this._lists.count(args.query);
    }

    private async _validateListInput(_list: Partial<List>, authUser: AuthUser) {
        this._validateAnyInput(_list, authUser);
        const list = await this._lists.findAndApply(_list);
        await this._isValidActiveList(list, authUser);
    }

    private _validateAnyInput(input: { id?: string; client_id?: number }, authUser: AuthUser) {
        const type = this._getUserType(authUser);
        const clientId = this._getUserClientId(authUser);
        if (type === SUPERADMIN) return;
        // if is create and no client id set it to the authUser client id
        if (!input.id && input.client_id == null) {
            input.client_id = clientId;
        }
        if (type === DATAADMIN || (input.client_id && clientId !== input.client_id)) {
            throw new ts.TSError("User doesn't have permission to write to that client", {
                statusCode: 403,
            });
        }
    }

    private _getUserType(authUser: AuthUser) {
        if (!authUser) return SUPERADMIN;
        if (!authUser.type) return USER;
        if (UserTypes.includes(authUser.type)) return authUser.type;

        throw new ts.TSError(`Forbidden User Type ${authUser.type}`, {
            statusCode: 403,
        });
    }

    private _getUserClientId(authUser: AuthUser): number {
        if (!authUser || authUser.type === SUPERADMIN) return 0;
        if (authUser.client_id == null) return -1;
        return authUser.client_id;
    }

    private async _validUsersList(userList: string[], authUser: AuthUser) {
        let userType;
        let userID: string | undefined;

        if (authUser) {
            userID = authUser.id;
            userType = this._getUserType(authUser);
        }

        if (!userList || userList.length === 0)  throw new ts.TSError('Invalid users field in list', { statusCode: 422 });

        let results: User[];
        try {
            results = await Promise.all(userList.map(id => this._aclManager.findUser({ id }, false)));
        } catch (err) {
            throw new ts.TSError('Invalid users field in list', { statusCode: 422 });
        }
            // A user not found would have thrown, so we can return true here
        if (userID && userType) {
            if (userType === 'USER') {
                const wasFound = results.find(foundUser => foundUser.id === userID);
                if (!wasFound) throw new ts.TSError('user id must be set in users list', { statusCode: 422 });
            }
        }

        return true;
    }

    private async _validXluceneList(list: string) {
        if (!list || list.length === 0)  throw new ts.TSError('Invalid list field in list', { statusCode: 422 });
        try {
            const matcher = new Matcher({ notification_rules: list }, this.logger);
            await matcher.init([]);
            return true;
        } catch (err) {
            throw new ts.TSError('Invalid list field in list', { statusCode: 422 });
        }
    }

    private async _validSpace(id: string) {
        if (!id || id.length === 0) throw new ts.TSError('Invalid space field in list', { statusCode: 422 });
        try {
            await this._aclManager.findSpace({ id }, false);
            return true;
        } catch (err) {
            throw new ts.TSError('Invalid space field in list', { statusCode: 422 });
        }
    }

    private async _validNotifications(list: Notifications[]) {
        if (!list || list.length === 0) throw new ts.TSError('Invalid notification field in list', { statusCode: 422 });
        validateNotifications(list);
        return true;
    }

    private async _isValidActiveList(list: Partial<List>, authUser: AuthUser) {
        const validations = [];

        if (list.active) {
            validations.push(
                this._validUsersList(list.users as string[], authUser),
                this._validXluceneList(list.list as string),
                this._validSpace(list.space as string),
                this._validNotifications(list.notifications as Notifications[]),
            );
        } else {
            if (list.users && list.users.length > 0) validations.push(this._validUsersList(list.users as string[], authUser));
            validations.push(this._validSpace(list.space as string));
        }

        await Promise.all(validations);
        return true;
    }
}
