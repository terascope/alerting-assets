
import TransFormSchema from '../transform/schema';
import { ConvictSchema }  from '@terascope/job-components';
import { WatcherConfig } from '../transform/interfaces';

export default class Schema extends ConvictSchema<WatcherConfig>{
    build() {
        const schema = new TransFormSchema(this.context).build();
        schema.type.default = 'matcher';
        return schema;
    }
}
