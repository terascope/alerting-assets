
import { WorkerContext, BatchProcessor, ExecutionConfig, DataEntity } from '@terascope/job-components';
import { WatcherConfig } from './interfaces';

export default class Watcher extends BatchProcessor<WatcherConfig> {

    constructor(context: WorkerContext, opConfig: WatcherConfig, executionConfig: ExecutionConfig) {
        super(context, opConfig, executionConfig);
    }

    async initialize() {
        // TODO: fetch list async and init WatcherManager
        const self = this;
        console.log('im being called in init', self)
    }

   async onBatch(data: DataEntity[]) {
        return data;
   }
}
