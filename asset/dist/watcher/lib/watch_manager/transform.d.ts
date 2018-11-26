import FilterBase from './base';
import { DataEntity } from '@terascope/job-components';
import { Notifier, TransformConfig, TypeOutput } from '../../interfaces';
export default class Transform extends FilterBase implements Notifier {
    private results;
    private config;
    constructor(config: TransformConfig);
    extraction(doc: DataEntity): void;
    validation(): boolean;
    output(): TypeOutput;
}
