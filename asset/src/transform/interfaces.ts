
import { OpConfig } from '@terascope/job-components';
import { TypeConfig } from 'xlucene-evaluator';

export enum NotifyType { matcher = 'matcher', extraction = 'extraction' }

export interface WatcherConfig extends OpConfig {
    rules: string[];
    plugins?: string[];
    types?: TypeConfig;
}

export interface SelectorTypes {
    [field: string]: string;
}
