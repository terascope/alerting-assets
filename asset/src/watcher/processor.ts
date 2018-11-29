
import { WorkerContext, BatchProcessor, ExecutionConfig, DataEntity } from '@terascope/job-components';
import { WatcherConfig } from './interfaces';
import WatcherManager from './lib/watch_manager';

export default class Watcher extends BatchProcessor<WatcherConfig> {
    private watchManager: WatcherManager;

    constructor(context: WorkerContext, opConfig: WatcherConfig, executionConfig: ExecutionConfig) {
        super(context, opConfig, executionConfig);
        this.watchManager = new WatcherManager(opConfig, context.logger)
    }

    async initialize() {
        return this.watchManager.init()
    }

   async onBatch(data: DataEntity[]) {
        return this.watchManager.run(data);
   }
}
