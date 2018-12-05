
import { DataEntity, Logger} from '@terascope/job-components';
//import Matcher from './match';
import { WatcherConfig,  /*Notifier, MatcherConfig, TransformConfig, NotifyType*/ } from '../../interfaces';
//import Transform from './transform';
//import PostProcessManager from '../post_process_manager';
import _ from 'lodash';
import Loader from '../loader';
import SelectionPhase from './selector_phase';
import TransformPhase from './transform_phase';
import PostProcessPhase from './post_process_phase';
import PhaseBase from './base';

export default class PhaseManager {
    private opConfig: WatcherConfig;
    private loader: Loader;
    private logger: Logger;
    private sequence: PhaseBase[];

    constructor(opConfig: WatcherConfig, logger:Logger) {
        this.opConfig = opConfig;
        this.loader = new Loader(opConfig)
        this.logger = logger;
        this.sequence = [];
    }


    public async init () {
        const { opConfig } = this;
        try {
            const configList = await this.loader.load();
            this.sequence = [
                new SelectionPhase(opConfig, configList),
                new TransformPhase(opConfig, configList),
                new PostProcessPhase(opConfig, configList)
            ];
        } 
        catch(err) {
            this.logger.error(`could not instantiate phase manager: ${err.message}`)
        }
    }

    public run(data: DataEntity[]): DataEntity[] {
        //const { opConfig, isMatcher, watcherList, postProcessManager } = this;
        const { sequence }  = this;
       
        return sequence.reduce<DataEntity[]>((data, phase:PhaseBase ) => {
            return phase.run(data);
        }, data)
        //@ts-ignore
        return results;
    }
}
