
import FilterBase from './base';
import { DataEntity } from '@terascope/job-components';
import { Notifier, MatcherConfig, TypeOutput } from '../../interfaces';

export default class Matcher extends FilterBase implements Notifier {
    //@ts-ignore
    private results: DataEntity;
    private config: MatcherConfig;

    constructor(config: MatcherConfig) {
        super(config.selector, config.selector_config);
        this.config = config;
    }

    extraction(doc: DataEntity) {
        this.results = doc;
    }

    output(): null | TypeOutput {
        const { results } = this;
        if (results === null) return results;
        return { data: results, selector: this.config.selector };
    }
}
