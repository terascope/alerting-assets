

import { DataEntity } from '@terascope/job-components';
import { OperationConfig, WatcherConfig, SelectionResults } from '../../interfaces';
import PhaseBase from './base';
import * as Ops from '../operations';
import _ from 'lodash';

export default class SelectionPhase implements PhaseBase {
    private opConfig: WatcherConfig;
    private selectionPhase: Ops.Selector[];

    constructor(opConfig: WatcherConfig, configList:OperationConfig[]) {
        this.opConfig = opConfig;
        const selectionPhase: Ops.Selector[] = [];
        const dict = {};
        _.forEach(configList, (config: OperationConfig) => {
            if (config.selector) dict[config.selector] = true
        });
        _.forOwn(dict, (_value, selector) => selectionPhase.push(new Ops.Selector(selector, this.opConfig.selector_config)))
        this.selectionPhase = selectionPhase;
    }

    public run(data: DataEntity[]): DataEntity[] {
        const { selectionPhase }  = this;

        if (selectionPhase.length > 0) {
            return data.reduce<DataEntity[]>((results, record) => {
                const recordList = selectionPhase.reduce<SelectionResults>((meta, selectorOp) => {
                    if (selectorOp.run(record)) {
                        meta.isSelected  = true;
                        meta.selectors[selectorOp.selector as string] = true;
                    }
                    return meta;
                }, { selectors: {}, isSelected: false });
                
                if (recordList.isSelected) {
                    //FIXME:temp hack
                    const otherRecord = Object.assign({}, record)
                    const match = new DataEntity(otherRecord, { selectors: recordList.selectors }); 
                    results.push(match);
                }
                
                return results;
            }, []);
        }
        return [];
    }
}
