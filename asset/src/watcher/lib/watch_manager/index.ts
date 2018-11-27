
import { DataEntity } from '@terascope/job-components';
import Matcher from './match';
import fs from 'fs';
import readline from 'readline';
import { WatcherConfig, Notifier, MatcherConfig, TransformConfig, NotifyType } from '../../interfaces';
import Transform from './transform';
import _ from 'lodash';

export default class WatcherManager {
    private watcherList: Notifier[];
    private loader: Function;
    private opConfig: WatcherConfig;

    constructor(opConfig: WatcherConfig) {
        this.watcherList = [];
        this.opConfig = opConfig;
        this.loader = this.determineLoader(opConfig);
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
        const config: TransformConfig = _.assign(
            {},
            {
                type: NotifyType.extraction,
                actions: opConfig.actions,
                selector_config: opConfig.selector_config
            },
            JSON.parse(_config)
        );
        this.watcherList.push(new Transform(config))
    }

    private async fileLoader() {
        // TODO need better type definitions here
        let loader = this.opConfig.type === 'matcher' ? this.loadMatcher : this.loadExtractor;
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

    //TODO: figure out metadata stuff
    public run(data: DataEntity[]): DataEntity[] {
        const { opConfig, watcherList } = this;

        return data.reduce((alerts: DataEntity[], doc:DataEntity) => {
            const recordData = { selector: <string[]>[], results: new DataEntity({}), hasMatch: false };
            const recordMatches =  watcherList.reduce((data, type) => {
                if (type.match(doc)) {
                    type.extraction(doc);
                    //TODO: how should we handle validation issues
                    type.validation(doc);
                    const output = type.output();
                    if (output !== null) {
                        data.hasMatch = true;
                        data.selector.push(output.selector);
                        data.results = _.merge(data.results, output.data);
                    }
                }
                return data;
            }, recordData);

            if (recordMatches.hasMatch) {
                const record = recordMatches.results;
                record.setMetadata('actions', opConfig.actions);
                record.setMetadata('selector', recordMatches.selector);
                alerts.push(record);
            }

            return alerts;
        }, []);
    }

}
