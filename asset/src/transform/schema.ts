
import { ConvictSchema }  from '@terascope/job-components';
import { WatcherConfig } from './interfaces';

export default class Schema extends ConvictSchema<WatcherConfig> {
    build() {
        return {
            type: {
                doc: 'determines if the watcher should return the whole record or transform the returning results',
                default: 'transform',
                format: ['matcher', 'transform']
            },
            rules_file: {
                doc: 'if specified it will load the rules off of a file. It expects each configuration to be seperated by a new line',
                default: '',
                format: 'optional_String'
            },
            asset_name: {
                doc: 'if specified it will load the rules off of a file. It expects each configuration to be seperated by a new line',
                default: 'alerting-assets',
                format: 'optional_String'
            },
            connection: {
                doc: 'which elasticsearch client will be used',
                default: '',
                format: 'optional_String'
            },
            index: {
                doc: 'which elasticsearch index will be used',
                default: '',
                format: 'optional_String'
            },
            selector_config: {
                doc: 'if specified it sets describes the types on the incoming records',
                default: {}
            },
            actions: {
                doc: 'if specified it sets describes the actions that should occur on matching records',
                default: []
            }
        };
    }
}
