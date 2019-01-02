
import { ConvictSchema }  from '@terascope/job-components';
import { WatcherConfig } from '../transform/interfaces';

export default class Schema extends ConvictSchema<WatcherConfig> {

    validate(input: any) {
        const validatedSchema = super.validate(input);
        if (!input.file_path && !input.index) throw new Error('you must either specify a file path or the index to retrive the rules for this op');
        return validatedSchema;
    }
    build() {
        return {
            file_path: {
                doc: 'if specified it will load the rules off of a file. It expects each configuration to be seperated by a new line',
                default: '',
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
            }
        };
    }
}
