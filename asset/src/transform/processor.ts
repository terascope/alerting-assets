
import { WorkerContext, BatchProcessor, ExecutionConfig, DataEntity } from '@terascope/job-components';
import { WatcherConfig } from './interfaces';
import { PhaseManager } from 'ts-transforms';
import path from 'path';

export default class Watcher extends BatchProcessor<WatcherConfig> {
    private operationsManager!: PhaseManager;

    constructor(context: WorkerContext, opConfig: WatcherConfig, executionConfig: ExecutionConfig) {
        super(context, opConfig, executionConfig);
    }

    async initialize() {
        const assetPath = await this.context.apis.assets.getPath(this.opConfig.asset_name as string);
        const filePath = path.join(assetPath, this.opConfig.rules_file as string);
        const newOpConfig = Object.assign({}, this.opConfig, { file_path: filePath });
        this.operationsManager = new PhaseManager(newOpConfig, this.logger);
        return this.operationsManager.init();
    }

    async onBatch(data: DataEntity[]) {
        return this.operationsManager.run(data);
    }
}
