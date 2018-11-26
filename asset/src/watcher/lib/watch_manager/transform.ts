
import FilterBase from './base';
import { DataEntity } from '@terascope/job-components';
import { Notifier, TransformConfig, TypeOutput } from '../../interfaces';
import _ from 'lodash';

//TODO: fix this
export default class Transform extends FilterBase implements Notifier{
    //@ts-ignore
    private results: object | null;
    private config: TransformConfig;

    constructor(config: TransformConfig) {
        super(config.selector, config.selector_config);
        this.config = config;
    }

    extraction(doc: DataEntity) {
        const { config } = this;
        let results: object | null = {};
        let data = doc[config.source_field];

        if (config.regex) {
            if (data && typeof data === 'string') {
                const extractedField = data.match(config.regex);
                if (extractedField) {
                    _.set(results, config.target_field, extractedField[0])
                } else {
                    results = null;
                }
            } else {
                results = null;
            }
        } else {
            _.set(results, config.target_field, data)
        }

        // const results = {};
        this.results = results;
    }

    // TODO: flesh this out
    validation():boolean {
        return true;
    }

    output(): null | TypeOutput {
        const { results } = this;
        if (results === null) return results;
        return { data: results, selector: this.config.selector };
    }
}
