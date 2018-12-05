
import { DataEntity } from '@terascope/job-components';
import { OperationConfig } from '../../../../interfaces';
import OperationBase from '../base';
import _ from 'lodash';

export default class Transform implements OperationBase {
    private config: OperationConfig;

    constructor(config: OperationConfig) {
        this.config = config;
    }

    run(doc: DataEntity): DataEntity | null {
            const { config } = this;
            let results: object | null = null;
            let data = doc[config.source_field as string];

            if (data) {
                if (config.regex) {
                    if (data && typeof data === 'string') { 
                        const { regex } = config;
                        const extractedField = data.match(regex as string);
                        if (extractedField) {
                            const regexResult = extractedField.length === 1 ? extractedField[0] : extractedField[1];
                            if (regexResult) results =_.set({}, config.target_field as string, regexResult)
                        }
                    }
                } else if (config.start && config.end) {
                        let { end } = config;
                        if (end === "EOP") end = '&'
                        const indexStart = data.indexOf(config.start) + config.start.length;
                        let endInd = data.indexOf(end);
                        if (endInd === -1) endInd = data.length;
                        const extractedSlice = data.slice(indexStart, endInd);
                        if (extractedSlice) results = _.set({}, config.target_field as string, data.slice(indexStart, endInd))
                } else {
                    results = _.set({}, config.target_field as string, data)
                }
            }
            //FIXME: this should not be ignored
            //@ts-ignore
           return results;
        }
}
