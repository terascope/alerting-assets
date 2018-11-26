import { WorkerContext, BatchProcessor, ExecutionConfig, DataEntity } from '@terascope/job-components';
import { WatcherConfig } from './interfaces';
export default class Watcher extends BatchProcessor<WatcherConfig> {
    private watchManager;
    constructor(context: WorkerContext, opConfig: WatcherConfig, executionConfig: ExecutionConfig);
    initialize(): Promise<any>;
    onBatch(data: DataEntity[]): Promise<DataEntity[]>;
}
