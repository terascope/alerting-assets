
import { OpConfig } from '@terascope/job-components';
export enum NotifyType { matcher = "matcher", extraction = "extraction" }

export interface WatcherConfig extends OpConfig {
    type: string;
    file_path: string | undefined;
    connection: string | undefined;
    index: string | undefined;
    selector_config: object | undefined;
    actions: object[];
}
