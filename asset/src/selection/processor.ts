
import { WorkerContext, BatchProcessor, ExecutionConfig, DataEntity } from '@terascope/job-components';
import { WatcherConfig } from  '../transform/interfaces';
import { SelectionPhase, Loader } from 'ts-transforms';
import path from 'path';

export default class Watcher extends BatchProcessor<WatcherConfig> {
    private phase!: SelectionPhase;

    constructor(context: WorkerContext, opConfig: WatcherConfig, executionConfig: ExecutionConfig) {
        super(context, opConfig, executionConfig);
    }

    async initialize() {
        const assetPath = await this.context.apis.assets.getPath('alerting-assets');
        const filePath = path.join(assetPath, this.opConfig.file_path as string);
        const newOpConfig = Object.assign({}, this.opConfig, { file_path: filePath });
        const loader = new Loader(newOpConfig);
        const configList = await loader.load();
        this.phase = new SelectionPhase(newOpConfig, configList);
    }

    async onBatch(data: DataEntity[]) {
        return this.phase.run(data);
    }
}
