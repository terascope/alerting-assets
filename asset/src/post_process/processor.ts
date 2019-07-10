
import { WorkerContext, BatchProcessor, ExecutionConfig, DataEntity } from '@terascope/job-components';
import { WatcherConfig } from  '../transform/interfaces';
import { PostProcessPhase, Loader, OperationsManager } from 'ts-transforms';
import { loadResources } from '../utils';

export default class PostProcess extends BatchProcessor<WatcherConfig> {
    private phase!: PostProcessPhase;

    constructor(context: WorkerContext, opConfig: WatcherConfig, executionConfig: ExecutionConfig) {
        super(context, opConfig, executionConfig);
    }

    async initialize() {
        const { getPath } = this.context.apis.assets;
        const { opConfig, plugins } = await loadResources(this.opConfig, getPath);
        const loader = new Loader(opConfig, this.logger);
        const opsManager = new OperationsManager(plugins);
        const { postProcessing } = await loader.load(opsManager);
        this.phase = new PostProcessPhase(opConfig, postProcessing, opsManager);
    }

    async onBatch(data: DataEntity[]) {
        return this.phase.run(data);
    }
}
