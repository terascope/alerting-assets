
import { DataEntity } from '@terascope/job-components';
import { JoinConfig } from '../../../../interfaces';
import _ from 'lodash';
import OperationBase from '../base'

export default class Join implements OperationBase{ 
    private config: JoinConfig

    constructor(config: JoinConfig) { 
        this.config = config;
    }
    
    run(doc: DataEntity): DataEntity | null {
        const { config } = this;
        const delimiter = config.delimiter !== undefined ? config.delimiter : '';
        const fields = config.fields.map(field => _.get(doc, field));
        const results = fields.join(delimiter);
        if (config.remove_source) {
            const final = {}
            final[config.target_field] = results;
            return new DataEntity(final, doc.getMetadata())
        }
        doc[config.target_field] = results;
        return doc;
    }
}