
import { WorkerContext, BatchProcessor, ExecutionConfig, DataEntity } from '@terascope/job-components';
import { DetectorConfig } from './interfaces';
import { Matcher } from 'ts-transforms';

export default class Detector extends BatchProcessor<DetectorConfig> {
    private matcher!: Matcher;

    constructor(context: WorkerContext, opConfig: DetectorConfig, executionConfig: ExecutionConfig) {
        super(context, opConfig, executionConfig);
    }

    async initialize() {

        // fetch list and metadata
        const rules: string[] = [];
        const config = Object.assign({}, this.opConfig, { rules });
        // Setup Matcher
        this.matcher = new Matcher(config, this.logger);
        return this.matcher.init();

        // set up timer to refetch list and reinstantiate matcher
    }

    async onBatch(data: DataEntity[]) {

        // hold to see if it can run => wait for reinstantiation

        // Match data
        const matchedData = this.matcher.run(data);
        // check for interval of when to release event

        // Use ACL to trim keys of matched data

        // Return data that is formatted to an interface for Notifier

        return matchedData;
    }
}
