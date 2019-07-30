
import { Client } from 'elasticsearch';

const {
    ELASTICSEARCH_HOST = 'http://localhost:9200',
} = process.env;

export function makeClient(): Client {
    return new Client({
        host: ELASTICSEARCH_HOST,
        log: 'error',
        apiVersion: '6.5'
    });
}

// @ts-ignore
export async function cleanupIndex(client: Client, namespace:string) {
    return client.indices.delete({
        index: `${namespace}*`,
        ignoreUnavailable: true,
    });
}
