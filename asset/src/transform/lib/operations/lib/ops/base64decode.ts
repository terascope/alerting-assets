
import { DataEntity } from '@terascope/job-components';
import { OperationConfig } from '../../../../interfaces';
import _ from 'lodash';
import OperationBase from '../base'

export default class Base64Encode extends OperationBase { 
    protected source: string;
    protected target: string;

    constructor(config: OperationConfig) {
        super();
        this.validate(config);
        this.source = '';
        this.target = '';
    }

    validate(config: OperationConfig) {
        const { target_field: tField, source_field: sField } = config;
        if (!tField || typeof tField !== 'string' || tField.length === 0) throw new Error(`could not find target_field for ${this.constructor.name} validation or it is improperly formatted, config: ${JSON.stringify(config)}`);
        if (!sField || typeof sField !== 'string' || sField.length === 0) throw new Error(`could not find source_field for ${this.constructor.name} validation or it is improperly formatted, config: ${JSON.stringify(config)}`);
        const source = this.parseField(sField);
        const target = this.parseField(tField);
        this.source = source;
        this.target = target;
    }
    
    run(doc: DataEntity | null): DataEntity | null {
        if (!doc) return doc;
        try {
            const buff = Buffer.from(doc[this.source]);
            doc[this.target] = buff.toString('base64');
        } catch(err) {
            _.unset(doc, this.source);
        }
        return doc;
    }
}