
import FilterBase from './base';
import { DataEntity } from '@terascope/job-components';
import { Notifier, MatcherConfig } from '../../interfaces';

//TODO: fix this
export default class Transform extends FilterBase implements Notifier{
    private results: DataEntity | object
    constructor(config: MatcherConfig) {
        super(config.selector, config.selector_config);
        this.results = {};
    }

    extraction(doc: DataEntity) {
        this.results = doc;
    }

    validation():boolean {
        return true;
    }

    output(): DataEntity {
        return new DataEntity(this.results);
    }
}
