
import 'jest-extended';
import { Client } from 'elasticsearch';
import Lists, { List } from '../../asset/src/lists/model';
import { CreateRecordInput, UpdateRecordInput } from 'elasticsearch-store';
import { TSError, get, startsWith } from '@terascope/job-components';

const {
    ELASTICSEARCH_HOST = 'http://localhost:9200',
} = process.env;

function makeClient(): Client {
    return new Client({
        host: ELASTICSEARCH_HOST,
        log: 'error',
        apiVersion: '6.5'
    });
}

async function cleanupIndex(lists: Lists) {
    const { client, indexQuery } = lists.store;

    return client.indices.delete({
        index: indexQuery,
        requestTimeout: 3000,
        ignoreUnavailable: true,
    }).catch(() => {});
}

function isLaterThan(newDate: string, oldDate: string) {
    return new Date(newDate).getTime() > new Date(oldDate).getTime();
}

describe('Lists', () => {

    const client = makeClient();
    const config = { namespace: 'test_list' };
    const lists = new Lists(client, config);

    beforeAll(async () => {
        await cleanupIndex(lists);
        await lists.initialize();
    });

    afterAll(async () => {
        await cleanupIndex(lists);
        await lists.shutdown();
    });

    it('can create a list', async () => {
        const list: CreateRecordInput<List> = {
            list: 'key:field AND other:things',
            active: false,
            client_id: 1,
            users: ['someUserId'],
            name: 'List 1',
            space: 'space_1',
            notifications: []
        };

        const results = await lists.create(list);

        expect(results).toBeDefined();
        expect(results.id).toBeDefined();
        expect(results.created).toBeDefined();
        expect(results.updated).toBeDefined();
    });

    it('cannot create a list with same name and client_id', async () => {
        const list1: CreateRecordInput<List> = {
            list: 'key:field AND other:things',
            active: false,
            client_id: 1,
            users: ['someUserId'],
            name: 'List 1234',
            space: 'space_1234',
            notifications: []
        };
        const list2: CreateRecordInput<List> = {
            list: 'key:field AND other:things',
            active: false,
            client_id: 1,
            users: ['someUserId'],
            name: 'List 1234',
            space: 'space_1234',
            notifications: []
        };
        const list3: CreateRecordInput<List> = {
            list: 'key:field AND other:things',
            active: false,
            client_id: 11111,
            users: ['someUserId'],
            name: 'List 1234',
            space: 'space_4321',
            notifications: []
        };

        const results1 = await lists.create(list1);
        const results3 = await lists.create(list3);

        expect(results1).toBeDefined();
        expect(results1.id).toBeDefined();
        expect(results1.created).toBeDefined();
        expect(results1.updated).toBeDefined();

        expect(results3).toBeDefined();
        expect(results3.id).toBeDefined();
        expect(results3.created).toBeDefined();
        expect(results3.updated).toBeDefined();

        let errMsg;

        try {
            await lists.create(list2);
        } catch (err) {
            errMsg = err;
        }

        expect(errMsg.message).toEqual('List requires name to be unique');
    });

    it('can update a list', async () => {
        const list: CreateRecordInput<List> = {
            list: 'key:field OR other:things',
            active: false,
            client_id: 1,
            users: ['otherUserId'],
            name: 'List 2',
            space: 'space_1',
            notifications: []
        };

        const { id, updated: firstUpdated, created: firstCreated } = await lists.create(list);
        const notifications = [{ type: 'text', config: { some: 'config' } }];
        const updateList: UpdateRecordInput<List> = Object.assign({}, list, { id, active: true, notifications });

        await lists.update(updateList);
        const results = await lists.findById(id);

        expect(results).toBeDefined();
        expect(results.active).toEqual(true);
        expect(results.created).toEqual(firstCreated);
        expect(isLaterThan(results.updated, firstUpdated)).toEqual(true);
        expect(results.notifications.length).toEqual(1);
        expect(results.notifications[0]).toEqual(notifications[0]);
    });

    it('can get the list', async() => {
        const list: CreateRecordInput<List> = {
            list: 'key:field',
            active: false,
            client_id: 1,
            users: ['otherUserId'],
            name: 'List 3',
            space: 'space_1',
            notifications: []
        };

        const { id } = await lists.create(list);

        const results = await lists.findByAnyId(id);

        expect(results).toBeDefined();
        for (const key in list) {
            expect(results[key]).toEqual(list[key]);
        }
    });

    it('can get multiple list', async() => {
        const list1: CreateRecordInput<List> = {
            list: 'first:field',
            active: false,
            client_id: 1,
            users: ['otherUserId'],
            name: 'List 4',
            space: 'space_1',
            notifications: []
        };

        const list2: CreateRecordInput<List> = {
            list: 'second:field',
            active: false,
            client_id: 1,
            users: ['otherUserId'],
            name: 'List 5',
            space: 'space_1',
            notifications: []
        };

        const [{ id: id1 }, { id: id2 }] = await Promise.all([lists.create(list1), lists.create(list2)]);
        const query = `id:${id1} OR id:${id2}`;

        const results = await lists.find(query);

        expect(Array.isArray(results)).toEqual(true);
        expect(results.length).toEqual(2);

        const [results1, results2] = results;

        for (const key in list1) {
            expect(results1[key]).toEqual(list1[key]);
        }

        for (const key in list2) {
            expect(results2[key]).toEqual(list2[key]);
        }
    });

    it('can remove a list', async() => {
        const list: CreateRecordInput<List> = {
            list: 'some:data',
            active: false,
            client_id: 1,
            users: ['otherUserId'],
            name: 'List 6',
            space: 'space_1',
            notifications: []
        };

        const { id } = await lists.create(list);

        await lists.deleteById(id);

        let myError: TSError|undefined;

        try {
            await lists.findByAnyId(id);
        } catch (err) {
            myError = err;
        }

        expect(myError).toBeDefined();
        const hasMessage = startsWith(get(myError, 'message'), `Unable to find List by id: "${id}"`);
        expect(hasMessage).toEqual(true);
    });

    it('can count lists', async() => {
        const list: CreateRecordInput<List> = {
            list: 'some:data',
            active: false,
            client_id: 1,
            users: ['otherUserId'],
            name: 'List 61234',
            space: 'count_space',
            notifications: []
        };

        await lists.create(list);

        const query = `space:${list.space}`;
        const count = await lists.count(query);

        expect(count).toEqual(1);
    });
});
