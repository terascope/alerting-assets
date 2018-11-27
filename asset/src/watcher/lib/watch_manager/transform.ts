
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
        let results: object | null = null;
        let data = doc[config.source_field];

        if (data) {
            if (config.regex) {
                if (data && typeof data === 'string') { 
                    const { regex } = config;
                    const extractedField = data.match(regex as string);
                    if (extractedField) {
                        const regexResult = extractedField.length === 1 ? extractedField[0] : extractedField[1];
                        if (regexResult) results =_.set({}, config.target_field, regexResult)
                    }
                }
            } else if (config.start && config.end) {
                    let { end } = config;
                    if (end === "EOP") end = '&'
                    const indexStart = data.indexOf(config.start) + config.start.length;
                    let endInd = data.indexOf(end);
                    if (endInd === -1) endInd = data.length;
                    const extractedSlice = data.slice(indexStart, endInd);
                    if (extractedSlice) results = _.set({}, config.target_field, data.slice(indexStart, endInd))
            } else {
                results = _.set({}, config.target_field, data)
            }
        }

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
