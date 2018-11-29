import { ConvictSchema } from '@terascope/job-components';
import { WatcherConfig } from './interfaces';
export default class Schema extends ConvictSchema<WatcherConfig> {
    build(): {
        type: {
            doc: string;
            default: string;
            format: string[];
        };
        file_path: {
            doc: string;
            default: string;
        };
        connection: {
            doc: string;
            default: string;
        };
        index: {
            doc: string;
            default: string;
        };
        selector_config: {
            doc: string;
            default: {};
        };
        actions: {
            doc: string;
            default: never[];
        };
    };
}
