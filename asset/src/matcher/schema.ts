
import * as TransFormSchema from '../transform/schema';
import { ConvictSchema }  from '@terascope/job-components';
import { WatcherConfig } from '../transform/interfaces';

const importedSchema = TransFormSchema.default || TransFormSchema;

export default class Schema extends ConvictSchema<WatcherConfig>{
    build() {
        const { context } = this;
        //@ts-ignore
        const schema = new importedSchema(context).build();
        schema.type.default = 'matcher'
        return schema;
    }
}
