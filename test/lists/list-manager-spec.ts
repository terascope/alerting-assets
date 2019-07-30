
import 'jest-extended';
import { ListManager, List, Email } from '../../asset/src/lists';
// @ts-ignore
import { CreateRecordInput, UpdateRecordInput } from 'elasticsearch-store';
import { ACLManager, User, Space } from '@terascope/data-access';
// @ts-ignore
import { TSError, get, pDelay } from '@terascope/job-components';
import { LATEST_VERSION } from '@terascope/data-types';
import { makeClient, cleanupIndex } from '../utils';

const namespace = 'test_list_manager';

// @ts-ignore
function isLaterThan(newDate: string, oldDate: string) {
    return new Date(newDate).getTime() > new Date(oldDate).getTime();
}

// TODO: test regualr admin

describe('ListManager', () => {

    const client = makeClient();
    const config = { namespace };
    const aclManager = new ACLManager(client, config);
    const listManager = new ListManager(client, config, aclManager);

    let superAdminUser: User;
    let normalUser: User;
    let normalAdmin: User;
    let dataAdmin: User;
    let space1: Space;

    const goodEmailNotification: Email = {
        type: 'EMAIL',
        config: {
            subject: 'an alert',
            from: 'busniess@othercompany.com',
            to: ['person@company.com'],
        }
    };

    beforeAll(async () => {
        await cleanupIndex(client, namespace);
        await listManager.initialize();

        const normalRole = await aclManager.createRole(
            {
                role: {
                    client_id: 1,
                    name: 'Example Role',
                },
            },
            false
        );

        [superAdminUser, normalUser, normalAdmin, dataAdmin] = await Promise.all([
            aclManager.createUser(
                {
                    user: {
                        username: 'super-admin',
                        email: 'super-admin@example.com',
                        firstname: 'Super',
                        lastname: 'Admin',
                        type: 'SUPERADMIN',
                        client_id: 0,
                    },
                    password: 'password',
                },
                false
            ),
            aclManager.createUser(
                {
                    user: {
                        username: 'user-user',
                        email: 'user-user@example.com',
                        firstname: 'User',
                        lastname: 'User',
                        type: 'USER',
                        role: normalRole.id,
                        client_id: 1,
                    },
                    password: 'password',
                },
                false
            ),
            aclManager.createUser(
                {
                    user: {
                        username: 'admin',
                        email: 'admin@example.com',
                        firstname: 'Main',
                        lastname: 'Admin',
                        type: 'ADMIN',
                        client_id: 1,
                    },
                    password: 'password',
                },
                false
            ),
            aclManager.createUser(
                {
                    user: {
                        username: 'dataadmin',
                        email: 'dataadmin@example.com',
                        firstname: 'Main',
                        lastname: 'DataAdmin',
                        type: 'DATAADMIN',
                        client_id: 1,
                    },
                    password: 'password',
                },
                false
            ),
        ]);

        const dataType = await aclManager.createDataType(
            {
                dataType: {
                    client_id: 1,
                    name: 'SomeTestDataType',
                    config: {
                        fields: {
                            hello: { type: 'Keyword' },
                        },
                        version: LATEST_VERSION,
                    },
                },
            },
            superAdminUser
        );

        space1 = await aclManager.createSpace(
            {
                space: {
                    type: 'SEARCH',
                    client_id: 1,
                    name: 'SomeRandomExampleSpace',
                    endpoint: 'some-random-example-space',
                    data_type: dataType.id,
                    roles: [],
                    views: [],
                },
            },
            false
        );
    });

    afterAll(async () => {
        await cleanupIndex(client, namespace);
        await listManager.shutdown();
    });

    describe('on list creation', () => {
        it('any program can create a list for any client', async () => {
            const list: CreateRecordInput<List> = {
                list: 'key:field AND other:things',
                active: false,
                client_id: 234,
                users: [superAdminUser.id],
                name: 'List 1',
                notifications: [],
                space: space1.id
            };

            const results = await listManager.createList({ list }, false);

            expect(results).toBeDefined();
            expect(results.id).toBeDefined();
            expect(results.created).toBeDefined();
            expect(results.updated).toBeDefined();
        });

        it('SUPERADMIN can create a list for any client', async () => {
            const list: CreateRecordInput<List> = {
                list: 'key:field AND other:things',
                active: false,
                client_id: 234,
                users: [superAdminUser.id],
                name: 'List 2',
                notifications: [],
                space: space1.id
            };

            const results = await listManager.createList({ list }, superAdminUser);

            expect(results).toBeDefined();
            expect(results.id).toBeDefined();
            expect(results.created).toBeDefined();
            expect(results.updated).toBeDefined();
        });

        it('ADMIN can create a list for itself', async () => {
            const list: CreateRecordInput<List> = {
                list: 'key:field OR other:things',
                active: false,
                client_id: 1,
                users: [],
                name: 'List 3',
                notifications: [],
                space: space1.id
            };

            const results = await listManager.createList({ list }, normalAdmin);

            expect(results).toBeDefined();
            expect(results.id).toBeDefined();
            expect(results.created).toBeDefined();
            expect(results.updated).toBeDefined();
        });

        it('USER can create a list for itself', async () => {
            const list: CreateRecordInput<List> = {
                list: 'key:field OR other:things',
                active: false,
                client_id: 1,
                users: [],
                name: 'List 4',
                notifications: [],
                space: space1.id
            };

            const results = await listManager.createList({ list }, normalUser);

            expect(results).toBeDefined();
            expect(results.id).toBeDefined();
            expect(results.created).toBeDefined();
            expect(results.updated).toBeDefined();
        });

        it('USER cannot create a list for another client_id', async () => {
            expect.hasAssertions();
            const list: CreateRecordInput<List> = {
                list: 'key:field OR other:things',
                active: false,
                client_id: 234,
                users: [],
                name: 'List 5',
                notifications: [],
                space: space1.id
            };

            try {
                await listManager.createList({ list }, normalUser);
            } catch (err) {
                expect(err.message).toEqual("User doesn't have permission to write to that client");
                expect(err.statusCode).toEqual(403);
                expect(err.code).toEqual('FORBIDDEN');
            }
        });

        it('ADMIN cannot create a list for another client_id', async () => {
            expect.hasAssertions();
            const list: CreateRecordInput<List> = {
                list: 'key:field OR other:things',
                active: false,
                client_id: 234,
                users: [],
                name: 'List 5',
                notifications: [],
                space: space1.id
            };

            try {
                await listManager.createList({ list }, normalAdmin);
            } catch (err) {
                expect(err.message).toEqual("User doesn't have permission to write to that client");
                expect(err.statusCode).toEqual(403);
                expect(err.code).toEqual('FORBIDDEN');
            }
        });

        it('DATAADMIN cannot create a list', async () => {
            expect.hasAssertions();
            const list: CreateRecordInput<List> = {
                list: 'key:field OR other:things',
                active: false,
                client_id: 234,
                users: [],
                name: 'List 6',
                notifications: [],
                space: space1.id
            };

            try {
                await listManager.createList({ list }, dataAdmin);
            } catch (err) {
                expect(err.message).toEqual("User doesn't have permission to write to that client");
                expect(err.statusCode).toEqual(403);
                expect(err.code).toEqual('FORBIDDEN');
            }
        });

        it('USER => if users lists is set it must have its own user id in it', async () => {
            expect.hasAssertions();

            const invalidUserlist: CreateRecordInput<List> = {
                list: 'key:field OR other:things',
                active: false,
                client_id: 1,
                users: [normalAdmin.id],
                name: 'List 1',
                notifications: [],
                space: space1.id
            };

            const correctUserList: CreateRecordInput<List> = {
                list: 'key:field OR other:things',
                active: false,
                client_id: 1,
                users: [normalUser.id, normalAdmin.id],
                name: 'List 2',
                notifications: [],
                space: space1.id
            };

            try {
                await listManager.createList({ list: invalidUserlist }, normalUser);
                throw new Error('this should have failed from createList');
            } catch (err) {
                expect(err.message).toEqual('user id must be set in users list');
                expect(err.statusCode).toEqual(422);
            }

            const results = await listManager.createList({ list: correctUserList }, normalUser);

            expect(results).toBeDefined();
            expect(results.id).toBeDefined();
            expect(results.created).toBeDefined();
            expect(results.updated).toBeDefined();
        });

        it('ADMIN can create a users list without using his own user id in users list', async () => {
            expect.hasAssertions();

            const correctUserList: CreateRecordInput<List> = {
                list: 'key:field OR other:things',
                active: false,
                client_id: 1,
                users: [normalUser.id],
                name: 'List 21234',
                notifications: [],
                space: space1.id
            };

            const results = await listManager.createList({ list: correctUserList }, normalAdmin);

            expect(results).toBeDefined();
            expect(results.id).toBeDefined();
            expect(results.created).toBeDefined();
            expect(results.updated).toBeDefined();
        });

        it('any lists must have valid spaces', async () => {
            expect.hasAssertions();

            const badSpaceList: CreateRecordInput<List> = {
                list: 'some:thing AND other:things',
                active: true,
                client_id: 11,
                users: [normalUser.id],
                name: 'List 3',
                notifications: [goodEmailNotification],
                space: 'asdfiuopiasdf'
            };

            try {
                await listManager.createList({ list: badSpaceList }, false);
            } catch (err) {
                expect(err.message).toEqual('Invalid space field in list');
                expect(err.statusCode).toEqual(422);
            }
        });

        it('lists set to active must have valid users', async () => {
            expect.hasAssertions();

            const emptyUserlist: CreateRecordInput<List> = {
                list: 'key:field OR other:things',
                active: true,
                client_id: 11,
                users: [],
                name: 'List 1',
                notifications: [goodEmailNotification],
                space: space1.id
            };

            const invalidUserlist: CreateRecordInput<List> = {
                list: 'key:field OR other:things',
                active: true,
                client_id: 11,
                users: ['asdfasdf'],
                name: 'List 2',
                notifications: [goodEmailNotification],
                space: space1.id
            };

            try {
                await listManager.createList({ list: emptyUserlist }, false);
            } catch (err) {
                expect(err.message).toEqual('Invalid users field in list');
                expect(err.statusCode).toEqual(422);
            }

            try {
                await listManager.createList({ list: invalidUserlist }, false);
            } catch (err) {
                expect(err.message).toEqual('Invalid users field in list');
                expect(err.statusCode).toEqual(422);
            }
        });

        it('lists set to active must have valid lists', async () => {
            expect.hasAssertions();

            const emptyList: CreateRecordInput<List> = {
                list: '',
                active: true,
                client_id: 11,
                users: [normalUser.id],
                name: 'List 3',
                notifications: [goodEmailNotification],
                space: space1.id
            };

            const faltyList: CreateRecordInput<List> = {
                list: '{}dfas dfsad88973 ',
                active: true,
                client_id: 11,
                users: [superAdminUser.id],
                name: 'List 3',
                notifications: [goodEmailNotification],
                space: space1.id
            };

            try {
                await listManager.createList({ list: emptyList }, false);
            } catch (err) {
                expect(err.message).toEqual('Invalid list field in list');
                expect(err.statusCode).toEqual(422);
            }

            try {
                await listManager.createList({ list: faltyList }, false);
            } catch (err) {
                expect(err.message).toEqual('Invalid list field in list');
                expect(err.statusCode).toEqual(422);
            }
        });

        it('lists set to active must have proper notifications', async () => {
            expect.hasAssertions();

            const badSpaceList: CreateRecordInput<List> = {
                list: 'some:thing AND other:things',
                active: true,
                client_id: 1,
                users: [normalUser.id],
                name: 'List 21',
                 // @ts-ignore
                notifications: [{ type: 'other' }],
                space: space1.id
            };

            try {
                await listManager.createList({ list: badSpaceList }, false);
            } catch (err) {
                expect(err.message).toEqual('Notifications configurations must have a "type" and "config" field and be formatted correctly');
                expect(err.statusCode).toEqual(422);
            }
        });
    });

    describe('on subscription', () => {
        it('calls a function on all lists active lists on start', async () => {
            let results: List[] = [];
            const clientId = 1234;

            async function myCB(changedLists: List[]) {
                // simulate some async action
                await pDelay(10);
                results = changedLists;
            }

            const list1: CreateRecordInput<List> = {
                list: 'some:thing AND other:things',
                active: false,
                client_id: clientId,
                users: [normalUser.id],
                name: 'List 1',
                notifications: [goodEmailNotification],
                space: space1.id
            };

            const list2: CreateRecordInput<List> = {
                list: 'some:thing AND other:things',
                active: true,
                client_id: clientId,
                users: [normalUser.id],
                name: 'List 2',
                notifications: [goodEmailNotification],
                space: space1.id
            };

            await Promise.all([
                listManager.createList({ list: list1 }, false),
                listManager.createList({ list: list2 }, false)
            ]);

            const cbResults = await listManager.subscribe(clientId, myCB, 1000);

            expect(results).toBeArrayOfSize(1);
            expect(results[0].name).toEqual(list2.name);

            expect(cbResults).toBeDefined();
            expect(cbResults.unsubscribe).toBeFunction();
        });

        it('calls a function on lists that have updated', async () => {
            let results: List[] = [];
            const clientId = 5678;

            async function myCB(changedLists: List[]) {
                // simulate some async action
                results = changedLists;
                return results;
            }

            const list: CreateRecordInput<List> = {
                list: 'some:thing AND other:things',
                active: true,
                client_id: clientId,
                users: [normalUser.id],
                name: 'List 1',
                notifications: [goodEmailNotification],
                space: space1.id
            };

            const createdResult = await listManager.createList({ list }, false);
            const updatedList: UpdateRecordInput<List> = Object.assign({}, createdResult, { list: 'other:query' });
            const cbResults = await listManager.subscribe(clientId, myCB, 100);

            expect(results).toBeArrayOfSize(1);
            expect(results[0].name).toEqual(list.name);
            expect(results[0].list).toEqual(list.list);

            expect(cbResults).toBeDefined();
            expect(cbResults.unsubscribe).toBeFunction();

            // Nothing has changed so its an empty array

            await listManager.updateList({ list: updatedList }, false);

            await pDelay(110);

            expect(results).toBeArrayOfSize(1);
            expect(results[0].name).toEqual(list.name);
            expect(results[0].list).toEqual(updatedList.list);
        });

    });

    // it('can update a list', async () => {
    //     const list: CreateRecordInput<List> = {
    //         list: 'key:field OR other:things',
    //         active: false,
    //         client_id: 1,
    //         users: ['otherUserId'],
    //         name: 'List 2',
    //         notification_type: 'text',
    //         space: space1.id
    //     };

    //     const { id, updated: firstUpdated, created: firstCreated } = await listManager.createList({ list });

    //     const updateList: UpdateRecordInput<List> = Object.assign({}, list, { id, active: true });

    //     const results = await listManager.updateList({ list: updateList });

    //     expect(results).toBeDefined();
    //     expect(results.active).toEqual(true);
    //     expect(results.created).toEqual(firstCreated);
    //     expect(isLaterThan(results.updated, firstUpdated)).toEqual(true);
    // });

    // it('can get the list', async() => {
    //     const list: CreateRecordInput<List> = {
    //         list: 'key:field',
    //         active: false,
    //         client_id: 1,
    //         users: ['otherUserId'],
    //         name: 'List 3',
    //         notification_type: 'text',
    //         space: space1.id
    //     };

    //     const { id } = await listManager.createList({ list });

    //     const results = await listManager.findList({ id });

    //     expect(results).toBeDefined();
    //     for (const key in list) {
    //         expect(results[key]).toEqual(list[key]);
    //     }
    // });

    // it('can get multiple list', async() => {
    //     const list1: CreateRecordInput<List> = {
    //         list: 'first:field',
    //         active: false,
    //         client_id: 1,
    //         users: ['otherUserId'],
    //         name: 'List 4',
    //         notification_type: 'webhook',
    //         space: space1.id
    //     };

    //     const list2: CreateRecordInput<List> = {
    //         list: 'second:field',
    //         active: false,
    //         client_id: 1,
    //         users: ['otherUserId'],
    //         name: 'List 5',
    //         notifications: [],
    //         space: space1.id
    //     };

    //     const [{ id: id1 }, { id: id2 }] = await Promise.all([listManager.createList({ list: list1 }), listManager.createList({ list: list2 })]);
    //     const query = `id:${id1} OR id:${id2}`;

    //     const results = await listManager.findLists({ query });

    //     expect(Array.isArray(results)).toEqual(true);
    //     expect(results.length).toEqual(2);

    //     const [results1, results2] = results;

    //     for (const key in list1) {
    //         expect(results1[key]).toEqual(list1[key]);
    //     }

    //     for (const key in list2) {
    //         expect(results2[key]).toEqual(list2[key]);
    //     }
    // });

    // it('can remove a list', async() => {
    //     const list: CreateRecordInput<List> = {
    //         list: 'some:data',
    //         active: false,
    //         client_id: 1,
    //         users: ['otherUserId'],
    //         name: 'List 6',
    //         notification_type: 'text',

    //         space: space1.id
    //     };

    //     const { id } = await listManager.createList({ list });

    //     const isDeleted = await listManager.removeList({ id });

    //     expect(isDeleted).toEqual(true);

    //     let myError: TSError|undefined;

    //     try {
    //         await listManager.findList({ id });
    //     } catch (err) {
    //         myError = err;
    //     }

    //     expect(myError).toBeDefined();
    //     expect(get(myError, 'message')).toEqual(`Unable to find List by id: "${id}"`);
    // });

    // it('can count lists', async() => {
    //     const list: CreateRecordInput<List> = {
    //         list: 'some:data',
    //         active: false,
    //         client_id: 1,
    //         users: ['otherUserId'],
    //         name: 'List 61234',
    //         notification_type: 'text',

    //         space: 'count_space'
    //     };

    //     await listManager.createList({ list });

    //     const query = `space:${list.space}`;
    //     const count = await listManager.countLists({ query });

    //     expect(count).toEqual(1);
    // });
});
