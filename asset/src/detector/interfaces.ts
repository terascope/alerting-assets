
import { OpConfig, DataEntity } from '@terascope/job-components';
import ThrottledMatcher from './throttled-matcher';

export interface DetectorConfig extends OpConfig {
    client_id: number;
}

export interface Matchers {
    [key: string]: ThrottledMatcher;
}

export interface DetectorRecord extends DataEntity {
    data: DataEntity;
    client_id: string;
    list_id: string;
}

export type WrapperThrottledRun = (data: DataEntity[], results: DataEntity<DetectorRecord>[]) => void | DataEntity<DetectorRecord>[];
