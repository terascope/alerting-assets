

import { DocumentMatcher } from 'xlucene-evaluator';
import { DataEntity } from '@terascope/job-components';
import OperationBase from '../base';

export default class Selector implements OperationBase {
    private documentMatcher: DocumentMatcher;
    public selector: string;
    //TODO: fix the typeing add support for *
    constructor(luceneQuery: string, typeConfigs?: object) {
        this.selector = luceneQuery;
        this.documentMatcher = new DocumentMatcher(luceneQuery, typeConfigs)
    }

    run(doc: DataEntity): DataEntity | null {
        if (this.documentMatcher.match(doc)) return doc;
        return null;
    }
}
