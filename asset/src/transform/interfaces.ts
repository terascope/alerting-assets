
import { OpConfig } from '@terascope/job-components';

export enum NotifyType { matcher = 'matcher', extraction = 'extraction' }

export interface WatcherConfig extends OpConfig {
    type: string;
    rules: string[];
    plugins?: string[];
    types?: SelectorTypes;
}

export interface SelectorTypes {
    [field: string]: string;
}
