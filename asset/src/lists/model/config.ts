
import { IndexModelConfig, IndexModelRecord } from 'elasticsearch-store';

// TODO: should use datatypes to generate mapping here?
const config: IndexModelConfig<List> = {
    version: 1,
    name: 'lists',
    mapping: {
        properties: {
            client_id: {
                type: 'integer',
            },
            name: {
                type: 'keyword',
                fields: {
                    text: {
                        type: 'text',
                        analyzer: 'lowercase_keyword_analyzer',
                    },
                },
            },
            users: {
                type: 'keyword'
            },
            list: {
                type: 'keyword',
            },
            active: {
                type: 'boolean',
            },
            space: {
                type: 'keyword'
            },
            notifications: {
                properties: {
                    type: {
                        type: 'keyword'
                    },
                    config: {
                        type: 'object'
                    },
                }
            }
        },
    },
    schema: {
        properties: {
            client_id: {
                type: 'number',
                multipleOf: 1.0,
                minimum: 0,
            },
            name: {
                type: 'string',
            },
            description: {
                type: 'string',
            },
            list: {
                type: 'string',
            },
            active: {
                type: 'boolean',
                default: false
            },
            users: {
                type: 'array',
                items: {
                    type: 'string',
                },
                uniqueItems: true,
                default: [],
            },
            space: {
                type: 'string'
            },
            notifications: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string'
                        },
                        config: {
                            type: 'object',
                            additionalProperties: true
                        },
                    }
                },
                default: [],
            }
        },
        required: ['client_id', 'name', 'list', 'space'],
    },
    strictMode: false,
};

interface AnyObj {
    [key: string]: any;
}

export interface Notifications {
    type: string;
    config: AnyObj;
}

export interface List extends IndexModelRecord {
    list: string;
    active: boolean;
    users: string[];
    client_id: number;
    name: string;
    notifications: Notifications[];
    description?: string;
    space: string;
}

export default config;
