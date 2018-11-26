import FilterBase from './base';
import { DataEntity } from '@terascope/job-components';
import { Notifier, MatcherConfig, TypeOutput } from '../../interfaces';
export default class Matcher extends FilterBase implements Notifier {
    private results;
    private config;
    constructor(config: MatcherConfig);
    extraction(doc: DataEntity): void;
    validation(): boolean;
    output(): TypeOutput;
}
