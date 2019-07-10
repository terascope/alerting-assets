
import { ConvictSchema }  from '@terascope/job-components';
import { DetectorConfig } from './interfaces';

export default class Schema extends ConvictSchema<DetectorConfig> {
    // @ts-ignore
    validate(input: any) {
        // const validatedSchema = super.validate(input);
        // if (!Array.isArray(input.rules) || input.rules.length === 0) throw new Error('you must specify rules path to retrive the rules for this op');
        // return validatedSchema;
    }

    build() {
        return {
            client_id: {
                doc: 'the client_id to fetch lists',
                default: 1,
                format: Number
            }
        };
    }
}
