
import { DataEntity, OpConfig } from '@terascope/job-components';

export enum NotifyType { matcher = "matcher", extraction = "extraction" }

export interface TypeOutput {
    selector: string,
    data: DataEntity | object
}

export interface MatcherConfig {
    name?: string;
    selector: string;
    selector_config?: object | undefined;
    type: NotifyType;
    actions: object[]
} 

export interface TransformConfig extends MatcherConfig {
    source_field: string;
    start: string;
    end: string,
    target_field: string;
    regex?: string,
    validation?: Function;
    decoder?: string
}

export interface WatcherConfig extends OpConfig {
    type: string;
    file_path: string | undefined;
    connection: string | undefined;
    index: string | undefined;
    selector_config: object | undefined;
    actions: object[];
}

export interface Notifier {
    match(doc: DataEntity): boolean;
    validation(data: DataEntity): void;
    output (): null | TypeOutput;
    extraction(doc: DataEntity): void
}
