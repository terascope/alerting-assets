
import { DataEntity } from '@terascope/job-components';
import { OperationConfig } from '../../../../interfaces';
import _ from 'lodash';
import OperationBase from '../base'

export default class Number extends OperationBase { 
    constructor(config: OperationConfig) {
        super();
        this.validate(config);
    }
    
    run(doc: DataEntity | null): DataEntity | null {
        if (!doc) return doc;
        if (!_.isNumber(doc[this.source])) _.unset(doc, this.source);
        return doc;
    }
}