
import { IndexModelConfig } from 'elasticsearch-store';
import { List } from '../interfaces';
// TODO: should use datatypes to generate mapping here?
const config: IndexModelConfig<List> = {
    version: 1,
    name: 'lists',
    mapping: {
        properties: {
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

            name: {
                type: 'string',
            },
            description: {
                type: 'string',
                default: ''
            },
            list: {
                type: 'string',
                default: ''
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
        required: ['name', 'space'],
    },
    strict_mode: false,
    unique_fields: ['name']
};

export default config;
