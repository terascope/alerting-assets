
import { DataEntity, Logger} from '@terascope/job-components';
import Matcher from './match';
import fs from 'fs';
import readline from 'readline';
import { WatcherConfig, Notifier, MatcherConfig, TransformConfig, NotifyType } from '../../interfaces';
import Transform from './transform';
import PostProcessManager from '../post_process_manager';
import _ from 'lodash';

export default class WatcherManager {
    private watcherList: Notifier[];
    private loader: Function;
    private opConfig: WatcherConfig;
    private postProcessManager: PostProcessManager;
    private isMatcher: boolean;

    constructor(opConfig: WatcherConfig, logger:Logger) {
        this.watcherList = [];
        this.opConfig = opConfig;
        this.isMatcher = opConfig.type === 'matcher';
        this.loader = this.determineLoader(opConfig);
        this.postProcessManager = new PostProcessManager(logger)
    }

    private determineLoader(opConfig: WatcherConfig): Function {
        if (opConfig.file_path) {
           return this.fileLoader;
        }
        if (opConfig.connection && opConfig.index) {
            return this.esLoader;
        }
        throw new Error(`cound not determine how to load critera, config: ${JSON.stringify(opConfig)}`)
    }

    private async esLoader() {
        //TODO: implement me
    }

    private loadMatcher(_config:string) {
        const { opConfig } = this;
        const config: MatcherConfig = {
            selector: _config,
            selector_config: opConfig.selector_config,
            type: NotifyType.matcher,
            actions: opConfig.actions
        };
        this.watcherList.push(new Matcher(config))
    }

    private loadExtractor(_config:string) {
        const { opConfig } = this;
        const lineConfig = JSON.parse(_config);
        this.postProcessManager.inject(lineConfig);
        if (!lineConfig.operation) {
            const config: TransformConfig = _.assign(
                {},
                {
                    type: NotifyType.extraction,
                    actions: opConfig.actions,
                    selector_config: opConfig.selector_config
                },
                lineConfig
            );
            this.watcherList.push(new Transform(config))
        }
    }

    private async fileLoader() {
        // TODO: need better type definitions here
        let loader = this.isMatcher ? this.loadMatcher : this.loadExtractor;
        loader = loader.bind(this);
        const rl = readline.createInterface({
            input: fs.createReadStream(this.opConfig.file_path as string),
            crlfDelay: Infinity
          });
        //TODO: error handling here
          return new Promise((resolve) => {
            rl.on('line', loader);
              
            rl.on('close', () => {
                resolve();
              });
          })
    }

    public async init () {
        return this.loader();
    }

    public run(data: DataEntity[]): DataEntity[] {
        const { opConfig, isMatcher, watcherList, postProcessManager } = this;

        return data.reduce((alerts: DataEntity[], doc:DataEntity) => {
            const recordData = { selectorList: {}, hasMatch:  false };

            const recordMatches =  watcherList.reduce((data, type) => {
                if (type.match(doc)) {
                    type.extraction(doc);
                    const output = type.output();
                    if (output !== null) {
                        data.hasMatch = true;
                        if (!data.selectorList[output.selector]) data.selectorList[output.selector] = {};
                        data.selectorList[output.selector] = _.merge(data.selectorList[output.selector], output.data);
                    }
                }
                return data;
            }, recordData);

            if (recordMatches.hasMatch) {
                _.forOwn(recordMatches.selectorList, (value:object, selectorName: string) => {
                    let record: object | null = value;
                    if (!isMatcher) {
                        record = postProcessManager.run(selectorName, value);
                    }
                    if (record) alerts.push(DataEntity.make(record, { actions: opConfig.actions, selector: selectorName }))
                });
            }

            return alerts;
        }, []);
    }

}
