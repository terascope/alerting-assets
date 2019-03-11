
import { WorkerContext, BatchProcessor, ExecutionConfig, DataEntity } from '@terascope/job-components';
import { WatcherConfig } from  '../transform/interfaces';
import { SelectionPhase, Loader, OperationsManager } from 'ts-transforms';
import loadResources from '../load_resources';

export default class Selection extends BatchProcessor<WatcherConfig> {
    private phase!: SelectionPhase;

    constructor(context: WorkerContext, opConfig: WatcherConfig, executionConfig: ExecutionConfig) {
        super(context, opConfig, executionConfig);
    }

    async initialize() {
        const { getPath } = this.context.apis.assets;
        const { opConfig, plugins } = await loadResources(this.opConfig, getPath);
        const loader = new Loader(opConfig);
        const configList = await loader.load();
        const opsManager = new OperationsManager(plugins);
        this.phase = new SelectionPhase(opConfig, configList, opsManager);
    }

    async onBatch(data: DataEntity[]) {
        return this.phase.run(data);
    }
}
