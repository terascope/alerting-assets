
import { WorkerContext, BatchProcessor, ExecutionConfig, DataEntity } from '@terascope/job-components';
import { WatcherConfig } from './interfaces';
import { PhaseManager } from 'ts-transforms';
import loadResources from '../load_reasources';
import _ from 'lodash';

export default class Watcher extends BatchProcessor<WatcherConfig> {
    private phaseManager!: PhaseManager;

    constructor(context: WorkerContext, opConfig: WatcherConfig, executionConfig: ExecutionConfig) {
        super(context, opConfig, executionConfig);
    }

    async initialize() {
        const { getPath } = this.context.apis.assets;
        const { opConfig, plugins } = await loadResources(this.opConfig, getPath);
        this.phaseManager = new PhaseManager(opConfig, this.logger);
        return this.phaseManager.init(plugins);
    }

    async onBatch(data: DataEntity[]) {
        return this.phaseManager.run(data);
    }
}
