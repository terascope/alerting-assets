
import path from 'path';
import { WorkerTestHarness } from 'teraslice-test-harness';
import { DataEntity, pDelay } from '@terascope/job-components';
import { ACLManager, User } from '@terascope/data-access';
import { CreateRecordInput, UpdateRecordInput } from 'elasticsearch-store';
import { LATEST_VERSION } from '@terascope/data-types';
import { makeClient, cleanupIndex } from './utils';
import { ListManager, List, Email } from '../asset/src/lists';

const idField = '_key';
const dataAccessSpace = 'test_detector_data_access';
const listNameSpace = 'test_detector_space';

const clientId = 1;

function addTestMeta(obj:object, index: number) {
    return DataEntity.make(obj, { [idField]: index + 1 });
}

describe('detector', () => {
    const client = makeClient();
    const aclManager = new ACLManager(client, { namespace: dataAccessSpace });
    const listManager = new ListManager(client, { namespace: listNameSpace }, aclManager);
    // @ts-ignore
    let adminUser: User;
    let normalUser: User;
    // @ts-ignore
    let space1ID: string;
    // @ts-ignore

    let list1ID: string;
        // @ts-ignore

    let list2ID: string;
        // @ts-ignore

    let list3ID: string;
 // @ts-ignore
    const testDate = Date.now();
 // @ts-ignore
    const earlyTestDate = new Date(testDate).toISOString();
     // @ts-ignore
    const laterTestDate = new Date(testDate + 10000).toISOString();

    const goodEmailNotification: Email = {
        type: 'EMAIL',
        config: {
            subject: 'an alert',
            from: 'busniess@othercompany.com',
            to: ['person@company.com'],
        }
    };

    beforeAll(async () => {
        await Promise.all([
            cleanupIndex(client, dataAccessSpace),
            cleanupIndex(client, listNameSpace),
        ]);
        await listManager.initialize();

        const [adminRole, userRole] = await Promise.all([
            aclManager.createRole(
                {
                    role: {
                        client_id: 1,
                        name: 'Admin Role',
                    },
                },
                false
            ),
            aclManager.createRole(
                {
                    role: {
                        client_id: 1,
                        name: 'User Role',
                    },
                },
                false
            ),
        ]);

        [adminUser, normalUser] = await Promise.all([
            aclManager.createUser(
                {
                    user: {
                        username: 'admin',
                        email: 'admin@example.com',
                        firstname: 'IAM',
                        lastname: 'Admin',
                        type: 'ADMIN',
                        role: adminRole.id,
                        client_id: 1,
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
                        role: userRole.id,
                        client_id: 1,
                    },
                    password: 'password',
                },
                false
            ),
        ]);

        const [dataAccesDataType, dataType1, dataType2] = await Promise.all([
            aclManager.createDataType(
                {
                    dataType: {
                        client_id: 1,
                        name: dataAccessSpace,
                        config: {
                            fields: {
                                list: { type: 'Keyword' },
                                active: { type: 'Boolean' },
                                users: { type: 'Keyword' },
                                client_id: { type: 'Keyword' },
                                name: { type: 'Keyword' },
                                description: { type: 'Keyword' },
                                space: { type: 'Keyword' },
                                notifications: { type: 'Object' },
                            },
                            version: LATEST_VERSION,
                        },
                    },
                },
                false
            ),
            aclManager.createDataType(
                {
                    dataType: {
                        client_id: 1,
                        name: 'Data Type 1',
                        config: {
                            fields: {
                                list: { type: 'Integer' },
                                admin: { type: 'Boolean' },
                                iam: { type: 'Keyword' },
                            },
                            version: LATEST_VERSION,
                        },
                    },
                },
                false
            ),
            aclManager.createDataType(
                {
                    dataType: {
                        client_id: 1,
                        name: 'Data Type 2',
                        config: {
                            fields: {
                                list: { type: 'Integer' },
                                other: { type: 'Keyword' },
                                date: { type: 'Date' },
                            },
                            version: LATEST_VERSION,
                        },
                    },
                },
                false
            )
        ]);

        const[, space1, space2] = await Promise.all([
            aclManager.createSpace(
                {
                    space: {
                        type: 'SEARCH',
                        client_id: 1,
                        name: listNameSpace,
                        endpoint: listNameSpace,
                        data_type: dataAccesDataType.id,
                        roles: [adminRole.id, userRole.id],
                        views: [],
                    },
                },
                false
            ),
            aclManager.createSpace(
                {
                    space: {
                        type: 'SEARCH',
                        client_id: 1,
                        name: 'some space name 1',
                        endpoint: 'some space name 1',
                        data_type: dataType1.id,
                        roles: [adminRole.id, userRole.id],
                        views: [],
                    },
                },
                false
            ),
            aclManager.createSpace(
                {
                    space: {
                        type: 'SEARCH',
                        client_id: 1,
                        name: 'some space name 2',
                        endpoint: 'some space name 2',
                        data_type: dataType2.id,
                        roles: [adminRole.id, userRole.id],
                        views: [],
                    },
                },
                false
            )
        ]);

        space1ID = space1.id;

        const normalUserlist1: CreateRecordInput<List> = {
            list: 'list:1 \n key:field',
            active: true,
            client_id: clientId,
            users: [normalUser.id],
            name: 'List 1',
            notifications: [goodEmailNotification],
            space: space1.id
        };

        const normalUserlist2: CreateRecordInput<List> = {
            list: `list:2 \n other:things \n date:>=${earlyTestDate}`,
            active: true,
            client_id: clientId,
            users: [normalUser.id],
            name: 'List 2',
            notifications: [goodEmailNotification],
            space: space2.id
        };

        const adminUserlist1: CreateRecordInput<List> = {
            list: 'admin:true \n iam:admin AND list:3',
            active: true,
            client_id: clientId,
            users: [adminUser.id],
            name: 'List 3',
            notifications: [goodEmailNotification],
            space: space1.id
        };

        [{ id: list1ID }, { id: list2ID }, { id: list3ID }] = await Promise.all([
            listManager.createList({ list: normalUserlist1 }, false),
            listManager.createList({ list: normalUserlist2 }, false),
            listManager.createList({ list: adminUserlist1 }, false),
        ]);
    });

    afterAll(async () => {
        await Promise.all([
            cleanupIndex(client, dataAccessSpace),
            cleanupIndex(client, listNameSpace),
        ]);
    });

    let harness: WorkerTestHarness;

    beforeEach(async() => {
        const clients = [
            {
                type: 'elasticsearch',
                create: () => ({ client }),
            },
        ];

        const options = {
            assetDir: path.join(__dirname, '../asset'),
            clients
        };

        const opConfig = {
            _op: 'detector',
            data_access_namespace: dataAccessSpace,
            space_name: listNameSpace,
            notification_throttle: 50,
            subscription_timer: 100
        };

        harness = WorkerTestHarness.testProcessor(opConfig, options);
        const reader = harness.getOperation('test-reader');
        // @ts-ignore
        const fn = reader.fetch.bind(reader);
         // @ts-ignore
        // NOTE: we do not have a good story around added meta data to testing data
        reader.fetch = async (incDocs: DataEntity[]) => fn(incDocs.map(addTestMeta));
        await harness.initialize();
    });

    afterEach(async () => {
        return harness.shutdown();
    });

    it('should be able to match data', async () => {
        const slice1 = [{ list: 3 }];
        const slice2 = [{ list: 1 }, { date: laterTestDate }, { iam: 'admin', list: 3 }];

        const expectedResults = [
            {
                data: slice2[0],
                client_id: 1,
                list_id: list1ID
            },
            {
                data: slice2[1],
                client_id: 1,
                list_id: list2ID
            },
            {
                data: slice2[2],
                client_id: 1,
                list_id: list3ID
            }
        ];

        expect(await harness.runSlice(slice1)).toEqual([]);

        const results = await harness.runSlice(slice2);

        expectedResults.forEach((expectedResults) => {
            const data = results.find(obj => obj.list_id === expectedResults.list_id);
            expect(data).toBeDefined();
            expect(data!.client_id).toEqual(expectedResults.client_id);
            expect(data!.data).toEqual(expectedResults.data);
        });
    });

    it('should be refetch updated lists', async () => {
        const slice = [{ list: 4 }];
        const slice2 = [{ iam: 'user' }];

        const list: CreateRecordInput<List> = {
            list: 'list:4',
            active: true,
            client_id: clientId,
            users: [normalUser.id],
            name: 'List 4',
            notifications: [goodEmailNotification],
            space: space1ID
        };

        expect(await harness.runSlice(slice)).toEqual([]);

        const { id } = await listManager.createList({ list }, false);

        const results = {
            data: slice[0],
            client_id: 1,
            list_id: id
        };

        await pDelay(100);

        expect(await harness.runSlice(slice)).toEqual([results]);

        const updatedList: UpdateRecordInput<List> = {
            list: 'iam:user',
            active: true,
            client_id: clientId,
            users: [normalUser.id],
            name: 'List 4',
            notifications: [goodEmailNotification],
            space: space1ID,
            id
        };

        const results2 = {
            data: slice2[0],
            client_id: 1,
            list_id: id
        };

        await listManager.updateList({ list: updatedList }, false);

        await pDelay(100);

        expect(await harness.runSlice(slice)).toEqual([]);
        expect(await harness.runSlice(slice2)).toEqual([results2]);
    });

    it('can throttle the number of notifications that are returned for a list', async () => {
        const slice = [{ list: 1 }];

        const expectedResults = [
            {
                data: slice[0],
                client_id: 1,
                list_id: list1ID
            }
        ];

        expect(await harness.runSlice(slice)).toEqual(expectedResults);
        // it should be throttled now
        expect(await harness.runSlice(slice)).toEqual([]);

        await pDelay(60);

        expect(await harness.runSlice(slice)).toEqual(expectedResults);
    });

});
