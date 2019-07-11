
import { WorkerContext, BatchProcessor, ExecutionConfig, DataEntity } from '@terascope/job-components';
import { PhaseConfig } from '../transform/interfaces';
import { Matcher } from 'ts-transforms';
import { loadResources } from '../utils';

export default class Match extends BatchProcessor<PhaseConfig> {
    private matcher!: Matcher;

    constructor(context: WorkerContext, opConfig: PhaseConfig, executionConfig: ExecutionConfig) {
        super(context, opConfig, executionConfig);
    }

    async initialize() {
        const { getPath } = this.context.apis.assets;
        const { opConfig, plugins } = await loadResources(this.opConfig, getPath);
        this.matcher = new Matcher(opConfig, this.logger);
        return this.matcher.init(plugins);
    }

    async onBatch(data: DataEntity[]) {
        return this.matcher.run(data);
    }
}
