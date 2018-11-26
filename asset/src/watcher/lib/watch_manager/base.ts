
import { DocumentMatcher } from 'xlucene-evaluator';
import { DataEntity } from '@terascope/job-components';
import { TypeOutput } from '../../interfaces';

export default abstract class FilterBase {
    private documentMatcher: DocumentMatcher

    constructor(luceneQuery: string, typeConfigs?: object) {
        this.documentMatcher = new DocumentMatcher(luceneQuery, typeConfigs)
    }

    match(doc: DataEntity): boolean {
        return this.documentMatcher.match(doc);
    }

    abstract validation(data: DataEntity): void
    abstract output (): null | TypeOutput
    abstract extraction(data: DataEntity): void
}
