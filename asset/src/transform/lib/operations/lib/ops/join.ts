
import { DataEntity } from '@terascope/job-components';
import { JoinConfig } from '../../../../interfaces';
import _ from 'lodash';
import OperationBase from '../base'

export default class Join implements OperationBase{ 
    private config: JoinConfig

    constructor(config: JoinConfig) { 
        this.config = config;
    }
    
    run(doc: DataEntity | null): DataEntity | null {
        console.log('running top level join', doc)
        if (!doc) return doc;
        const { config } = this;
        const delimiter = config.delimiter !== undefined ? config.delimiter : '';
        const fields = config.fields.map(field => _.get(doc, field));
        const results = fields.join(delimiter);
        if (config.remove_source) {
            const final = {}
            if (results.length !== delimiter.length) final[config.target_field] = results;
            return new DataEntity(final, doc.getMetadata())
        }
        if (results.length !== delimiter.length) doc[config.target_field] = results;
        console.log('what is join returning', doc)
        return doc;
    }
}