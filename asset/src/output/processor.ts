
import { WorkerContext, BatchProcessor, ExecutionConfig, DataEntity } from '@terascope/job-components';
import { PhaseConfig } from  '../transform/interfaces';
import { OutputPhase, Loader, OperationsManager } from 'ts-transforms';
import { loadResources } from '../utils';

export default class Output extends BatchProcessor<PhaseConfig> {
    private phase!: OutputPhase;

    constructor(context: WorkerContext, opConfig: PhaseConfig, executionConfig: ExecutionConfig) {
        super(context, opConfig, executionConfig);
    }

    async initialize() {
        const { getPath } = this.context.apis.assets;
        const { opConfig, plugins } = await loadResources(this.opConfig, getPath);
        const loader = new Loader(opConfig, this.logger);
        const opsManager = new OperationsManager(plugins);
        const { output } = await loader.load(opsManager);
        this.phase = new OutputPhase(opConfig, output, opsManager);
    }

    async onBatch(data: DataEntity[]) {
        return this.phase.run(data);
    }
}
