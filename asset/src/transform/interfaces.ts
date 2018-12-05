
import { DataEntity, OpConfig } from '@terascope/job-components';
import PhaseBase from './lib/operations/base';
export enum NotifyType { matcher = "matcher", extraction = "extraction" }

export interface TypeOutput {
    selector: string,
    data: DataEntity | object
}

export interface SelectionResults {
    isSelected: boolean;
    selectors:  { [key: string]: boolean}
}

export interface MatcherConfig {
    name?: string;
    selector?: string;
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
    validation?: string;
    decoder?: string
}

export interface OperationConfig {
    id?: string;
    selector: string;
    selector_config?: object | undefined;
    source_field?: string;
    start?: string;
    end?: string,
    target_field?: string;
    regex?: string,
    validation?: string;
    decoder?: string;
    refs?: string;
    post_process?: string
}

export interface ChainedPostProcess {
    refs: string;
    validation?: string;
    target_field?: string;
    [key: string]: any;
}

export interface OperationsDictionary {
    [key: string]: PhaseBase[]
}

export interface InjectConfig {
    validation?: string;
    operation?: string;
    selector: string;
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
    output (): null | TypeOutput;
    extraction(doc: DataEntity): void
}

export interface JoinConfig {
    selector: string;
    operation: string;
    fields: string[];
    target_field: string;
    delimiter?: string;
    remove_source?: boolean
}
