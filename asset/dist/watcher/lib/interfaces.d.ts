export interface WatcherConfig {
    name?: string;
    selector: string;
    type: [];
    actions: [];
}
export interface TransformConfig extends WatcherConfig {
    source_field: string;
    start: string;
    end: string;
    target_field: string;
    validation?: Function;
    decoder?: string;
}
