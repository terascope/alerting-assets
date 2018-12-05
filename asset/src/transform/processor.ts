
import { WorkerContext, BatchProcessor, ExecutionConfig, DataEntity } from '@terascope/job-components';
import { WatcherConfig } from './interfaces';
import PhaseManager from './lib/phase_manager';

export default class Watcher extends BatchProcessor<WatcherConfig> {
    private operationsManager: PhaseManager;

    constructor(context: WorkerContext, opConfig: WatcherConfig, executionConfig: ExecutionConfig) {
        super(context, opConfig, executionConfig);
        this.operationsManager = new PhaseManager(opConfig, context.logger)
    }

    async initialize() {
        return this.operationsManager.init()
    }

   async onBatch(data: DataEntity[]) {
        return this.operationsManager.run(data);
   }
}
