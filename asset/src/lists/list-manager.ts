
import * as es from 'elasticsearch';
import * as ts from '@terascope/job-components';
import { CreateRecordInput, UpdateRecordInput } from 'elasticsearch-store';
import { ManagerConfig, FindOneArgs, FindArgs, AuthUser } from '@terascope/data-access';
import Lists, { List } from './model';

export class ListManager {
    logger: ts.Logger;
    private readonly _lists: Lists;

    constructor(client: es.Client, config: ManagerConfig) {
        this.logger = config.logger || ts.debugLogger('acl-manager');
        this._lists = new Lists(client, config);
    }

    async initialize() {
        return this._lists.initialize();
    }

    async shutdown() {
        return this._lists.shutdown();
    }

    // @ts-ignore
    async findList(args: FindOneArgs<List>, authUser?: AuthUser) {
        return this._lists.findByAnyId(args.id, args);
    }
    // @ts-ignore

    async findLists(args: FindArgs<List> = {}, authUser?: AuthUser) {
        return this._lists.find(args.query, args);
    }
    // @ts-ignore

    async createList(args: { list: CreateRecordInput<List> }, authUser?: AuthUser) {
        // TODO: validate that user and space exists
        // await this._validateListInput(args.list, authUser);
        // need to validate input
        return this._lists.create(args.list);
    }
    // @ts-ignore

    async updateList(args: { list: UpdateRecordInput<List> }, authUser?: AuthUser) {
         // need to validateCanUpdate
        // need to validate input
        await this._lists.update(args.list);
        return this._lists.findById(args.list.id, {});
    }
    // @ts-ignore

    async removeList(args: { id: string }, authUser?: AuthUser) {
        // need to validateCanRemove
        await this._lists.deleteById(args.id);
        return true;
    }

    // @ts-ignore
    async countLists(args: { query?: string } = {}, authUser?: AuthUser) {
        // TODO: should restrain by listQueryAcess
        return this._lists.count(args.query);
    }

    // private _validateAnyInput(input: { id?: string; client_id?: number }, authUser: i.AuthUser) {
    //     const type = this._getUserType(authUser);
    //     const clientId = this._getUserClientId(authUser);

    //     if (type === 'SUPERADMIN') return;

    //     // if is create and no client id set it to the authUser client id
    //     if (!input.id && input.client_id == null) {
    //         input.client_id = clientId;
    //     }

    //     if (input.client_id && clientId !== input.client_id) {
    //         throw new ts.TSError("User doesn't have permission to write to that client", {
    //             statusCode: 403,
    //         });
    //     }
    // }
}
