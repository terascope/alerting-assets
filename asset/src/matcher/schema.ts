
import * as TransFormSchema from '../transform/schema';
import { ConvictSchema }  from '@terascope/job-components';
import { WatcherConfig } from '../transform/interfaces';

export default class Schema extends ConvictSchema<WatcherConfig>{
    build() {
        const { context } = this;
        //@ts-ignore
        const schema = new TransFormSchema(context).build();
        schema.type.default = 'matcher'
        return schema;
    }
}
