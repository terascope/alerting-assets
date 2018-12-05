
import { DataEntity } from '@terascope/job-components';
import { OperationConfig, WatcherConfig, OperationsDictionary } from '../../interfaces';
import PhaseBase from './base';
import _ from 'lodash';
import * as Operations from '../operations'

export default class PostProcessPhase implements PhaseBase {
      //@ts-ignore
    private opConfig: WatcherConfig;
    private postProcessPhase: OperationsDictionary;
    private hasPostProcessing: boolean;

    constructor(opConfig: WatcherConfig, configList:OperationConfig[]) {
        this.opConfig = opConfig;
        const postProcessPhase: OperationsDictionary = {};

        _.forEach(configList, (config: OperationConfig) => {
            //post_process first
            if (config.selector && config.post_process) {
                const Op = Operations.opNames[config.post_process];
                if (!Op) throw new Error(`could not find post_process module ${config.post_process}`);
                if (!postProcessPhase[config.selector]) postProcessPhase[config.selector] = [];
                postProcessPhase[config.selector].push(new Op(config))
            }
        });

        _.forEach(configList, (config: OperationConfig) => {
            // then do validations
            if (config.selector && config.validation) {
                const Op = Operations.opNames[config.validation];
                if (!postProcessPhase[config.selector]) postProcessPhase[config.selector] = [];
                postProcessPhase[config.selector].push(new Op(config))
            }
        });

        // _.forEach(configList, (config: OperationConfig) => {          
        //     // convert refs to selectors
        //     if (config.selector && config.post_process) {
        //         if (!postProcessPhase[config.selector]) postProcessPhase[config.selector] = [];
        //         postProcessPhase[config.selector].push(new Operations.Transform(config))
        //     }
        // });
        this.postProcessPhase = postProcessPhase;
        this.hasPostProcessing = Object.keys(postProcessPhase).length > 0;
    }

    run(dataArray: DataEntity[]) {
        const { postProcessPhase, hasPostProcessing } = this;
        if (!hasPostProcessing) return dataArray;

        const resultsList: DataEntity[] = [];
        _.each(dataArray, (record) => {
            const selectors = record.getMetadata('selectors');
            //FIXME: not extracting, need to be in and out
            let results = record;
            _.forOwn(selectors, (_value, key) => {
                if (postProcessPhase[key]) {
                    results = postProcessPhase[key].reduce<DataEntity>((record, fn) => fn.run(record), results);
                }
            });
            if (Object.keys(results).length > 0) {
                //const newRecord = new DataEntity(results, { selectors });
                resultsList.push(results);
            }
        });

        return resultsList;
    }
  }