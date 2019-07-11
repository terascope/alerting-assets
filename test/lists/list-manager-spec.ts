
import 'jest-extended';
import { Client } from 'elasticsearch';
import { ListManager, List } from '../../asset/src/lists';
import { CreateRecordInput, UpdateRecordInput } from 'elasticsearch-store';
import { TSError, get } from '@terascope/job-components';

const {
    ELASTICSEARCH_HOST = 'http://localhost:9200',
} = process.env;

function makeClient(): Client {
    return new Client({
        host: ELASTICSEARCH_HOST,
        log: 'error',
        apiVersion: '6.8'
    });
}

async function cleanupIndex(manager: ListManager) {
    // @ts-ignore
    const { client, indexQuery } = manager._lists.store;

    return client.indices.delete({
        index: indexQuery,
        requestTimeout: 3000,
        ignoreUnavailable: true,
    }).catch(() => {});
}

function isLaterThan(newDate: string, oldDate: string) {
    return new Date(newDate).getTime() > new Date(oldDate).getTime();
}

describe('ListManager', () => {

    const client = makeClient();
    const config = { namespace: 'test_list' };
    const listManager = new ListManager(client, config);

    beforeAll(async () => {
        await cleanupIndex(listManager);
        await listManager.initialize();
    });

    afterAll(async () => {
        await cleanupIndex(listManager);
        await listManager.shutdown();
    });

    it('can create a list', async () => {
        const list: CreateRecordInput<List> = {
            list: 'key:field AND other:things',
            active: false,
            client_id: 1,
            users: ['someUserId'],
            name: 'List 1',
            notification_type: 'email',
            notification_config: {},
            space: 'space_1'
        };

        const results = await listManager.createList({ list });

        expect(results).toBeDefined();
        expect(results.id).toBeDefined();
        expect(results.created).toBeDefined();
        expect(results.updated).toBeDefined();
    });

    it('can update a list', async () => {
        const list: CreateRecordInput<List> = {
            list: 'key:field OR other:things',
            active: false,
            client_id: 1,
            users: ['otherUserId'],
            name: 'List 2',
            notification_type: 'text',
            notification_config: {},
            space: 'space_1'
        };

        const { id, updated: firstUpdated, created: firstCreated } = await listManager.createList({ list });

        const updateList: UpdateRecordInput<List> = Object.assign({}, list, { id, active: true });

        const results = await listManager.updateList({ list: updateList });

        expect(results).toBeDefined();
        expect(results.active).toEqual(true);
        expect(results.created).toEqual(firstCreated);
        expect(isLaterThan(results.updated, firstUpdated)).toEqual(true);
    });

    it('can get the list', async() => {
        const list: CreateRecordInput<List> = {
            list: 'key:field',
            active: false,
            client_id: 1,
            users: ['otherUserId'],
            name: 'List 3',
            notification_type: 'text',
            notification_config: {},
            space: 'space_1'
        };

        const { id } = await listManager.createList({ list });

        const results = await listManager.findList({ id });

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
            notification_type: 'webhook',
            notification_config: {},
            space: 'space_1'
        };

        const list2: CreateRecordInput<List> = {
            list: 'second:field',
            active: false,
            client_id: 1,
            users: ['otherUserId'],
            name: 'List 5',
            notification_type: 'email',
            notification_config: {},
            space: 'space_1'
        };

        const [{ id: id1 }, { id: id2 }] = await Promise.all([listManager.createList({ list: list1 }), listManager.createList({ list: list2 })]);
        const query = `id:${id1} OR id:${id2}`;

        const results = await listManager.findLists({ query });

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
            notification_type: 'text',
            notification_config: {},
            space: 'space_1'
        };

        const { id } = await listManager.createList({ list });

        const isDeleted = await listManager.removeList({ id });

        expect(isDeleted).toEqual(true);

        let myError: TSError|undefined;

        try {
            await listManager.findList({ id });
        } catch (err) {
            myError = err;
        }

        expect(myError).toBeDefined();
        expect(get(myError, 'message')).toEqual(`Unable to find List by id: "${id}"`);
    });

    it('can count lists', async() => {
        const list: CreateRecordInput<List> = {
            list: 'some:data',
            active: false,
            client_id: 1,
            users: ['otherUserId'],
            name: 'List 61234',
            notification_type: 'text',
            notification_config: {},
            space: 'count_space'
        };

        await listManager.createList({ list });

        const query = `space:${list.space}`;
        const count = await listManager.countLists({ query });

        expect(count).toEqual(1);
    });
});
