import { DataEntity } from '@terascope/job-components';
import { TypeOutput } from '../../interfaces';
export default abstract class FilterBase {
    private documentMatcher;
    constructor(luceneQuery: string, typeConfigs?: object);
    match(doc: DataEntity): boolean;
    abstract validation(data: DataEntity): void;
    abstract output(): null | TypeOutput;
    abstract extraction(data: DataEntity): void;
}
