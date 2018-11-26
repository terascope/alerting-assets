import { DataEntity } from '@terascope/job-components';
import { WatcherConfig } from '../../interfaces';
export default class WatcherManager {
    private watcherList;
    private loader;
    private opConfig;
    constructor(opConfig: WatcherConfig);
    private determineLoader;
    private esLoader;
    private loadMatcher;
    private loadExtractor;
    private fileLoader;
    init(): Promise<any>;
    run(data: DataEntity[]): DataEntity[];
}
