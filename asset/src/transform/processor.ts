
import { WorkerContext, BatchProcessor, ExecutionConfig, DataEntity } from '@terascope/job-components';
import { PhaseConfig } from './interfaces';
import { Transform } from 'ts-transforms';
import { loadResources } from '../utils';

export default class Transforms extends BatchProcessor<PhaseConfig> {
    private transform!: Transform;

    constructor(context: WorkerContext, opConfig: PhaseConfig, executionConfig: ExecutionConfig) {
        super(context, opConfig, executionConfig);
    }

    async initialize() {
        const { getPath } = this.context.apis.assets;
        const { opConfig, plugins } = await loadResources(this.opConfig, getPath);
        this.transform = new Transform(opConfig, this.logger);
        return this.transform.init(plugins);
    }

    async onBatch(data: DataEntity[]) {
        return this.transform.run(data);
    }
}
