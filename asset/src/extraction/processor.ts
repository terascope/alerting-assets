
import { WorkerContext, BatchProcessor, ExecutionConfig, DataEntity } from '@terascope/job-components';
import { WatcherConfig } from  '../transform/interfaces';
import { ExtractionPhase, Loader, OperationsManager } from 'ts-transforms';
import loadResources from '../load_resources';

export default class Extraction extends BatchProcessor<WatcherConfig> {
    private phase!: ExtractionPhase;

    constructor(context: WorkerContext, opConfig: WatcherConfig, executionConfig: ExecutionConfig) {
        super(context, opConfig, executionConfig);
    }

    async initialize() {
        const { getPath } = this.context.apis.assets;
        const { opConfig, plugins } = await loadResources(this.opConfig, getPath);
        const loader = new Loader(opConfig, this.logger);
        const opsManager = new OperationsManager(plugins);
        const { extractions } = await loader.load(opsManager);
        this.phase = new ExtractionPhase(opConfig, extractions, opsManager);
    }

    async onBatch(data: DataEntity[]) {
        return this.phase.run(data);
    }
}
