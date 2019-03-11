
import { WorkerContext, BatchProcessor, ExecutionConfig, DataEntity } from '@terascope/job-components';
import { WatcherConfig } from '../transform/interfaces';
import { Matcher } from 'ts-transforms';
import loadResources from '../load_resources';
import _ from 'lodash';

export default class Match extends BatchProcessor<WatcherConfig> {
    private matcher!: Matcher;

    constructor(context: WorkerContext, opConfig: WatcherConfig, executionConfig: ExecutionConfig) {
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
