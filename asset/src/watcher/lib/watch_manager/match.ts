
import FilterBase from './base';
import { DataEntity } from '@terascope/job-components';
import { Notifier, MatcherConfig } from '../../interfaces';

//TODO: need story on metadata
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

    validation():boolean {
        return true;
    }

    output(): DataEntity {
        const { results, config } = this;
        results.setMetadata('actions', config.actions);
        results.setMetadata('selector', config.selector);
        return results;
    }
}
