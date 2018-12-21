
import { OpConfig } from '@terascope/job-components';
export enum NotifyType { matcher = 'matcher', extraction = 'extraction' }

export interface WatcherConfig extends OpConfig {
    type: string;
    rules_file?: string;
    asset_name?: string;
    connection?: string;
    index?: string;
    selector_config?: object;
    actions?: object[];
}
