"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const job_components_1 = require("@terascope/job-components");
const match_1 = __importDefault(require("./match"));
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
const interfaces_1 = require("../../interfaces");
const transform_1 = __importDefault(require("./transform"));
const lodash_1 = __importDefault(require("lodash"));
class WatcherManager {
    constructor(opConfig) {
        this.watcherList = [];
        this.opConfig = opConfig;
        //this.watcher = Matcher;
        this.loader = this.determineLoader(opConfig);
    }
    determineLoader(opConfig) {
        if (opConfig.file_path) {
            return this.fileLoader;
        }
        if (opConfig.connection && opConfig.index) {
            return this.esLoader;
        }
        throw new Error(`cound not determine how to load critera, config: ${JSON.stringify(opConfig)}`);
    }
    async esLoader() {
        //TODO: implement me
    }
    loadMatcher(_config) {
        const { opConfig } = this;
        const config = {
            selector: _config,
            selector_config: opConfig.type_config,
            type: interfaces_1.NotifyType.matcher,
            actions: opConfig.actions
        };
        this.watcherList.push(new match_1.default(config));
    }
    loadExtractor(_config) {
        const { opConfig } = this;
        const config = lodash_1.default.assign({}, { type: interfaces_1.NotifyType.extraction, actions: opConfig.actions }, JSON.parse(_config));
        this.watcherList.push(new transform_1.default(config));
    }
    async fileLoader() {
        // TODO need better type definitions here
        let loader = this.opConfig.type === 'matcher' ? this.loadMatcher : this.loadExtractor;
        loader = loader.bind(this);
        const rl = readline_1.default.createInterface({
            input: fs_1.default.createReadStream(this.opConfig.file_path),
            crlfDelay: Infinity
        });
        //TODO: error handling here
        return new Promise((resolve) => {
            rl.on('line', loader);
            rl.on('close', () => {
                resolve();
            });
        });
    }
    async init() {
        return this.loader();
    }
    //TODO: figure out metadata stuff
    run(data) {
        const { opConfig, watcherList } = this;
        return data.reduce((alerts, doc) => {
            const recordData = { selector: [], results: new job_components_1.DataEntity({}), hasMatch: false };
            const recordMatches = watcherList.reduce((data, type) => {
                if (type.match(doc)) {
                    data.hasMatch = true;
                    type.extraction(doc);
                    //TODO: how should we handle validation issues
                    type.validation(doc);
                    const output = type.output();
                    data.selector.push(output.selector);
                    data.results = lodash_1.default.merge(data.results, output.data);
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
exports.default = WatcherManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvd2F0Y2hlci9saWIvd2F0Y2hfbWFuYWdlci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLDhEQUF1RDtBQUN2RCxvREFBOEI7QUFDOUIsNENBQW9CO0FBQ3BCLHdEQUFnQztBQUNoQyxpREFBdUc7QUFDdkcsNERBQW9DO0FBQ3BDLG9EQUF1QjtBQUV2QixNQUFxQixjQUFjO0lBTS9CLFlBQVksUUFBdUI7UUFDL0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU8sZUFBZSxDQUFDLFFBQXVCO1FBQzNDLElBQUksUUFBUSxDQUFDLFNBQVMsRUFBRTtZQUNyQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDekI7UUFDRCxJQUFJLFFBQVEsQ0FBQyxVQUFVLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtZQUN2QyxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7U0FDeEI7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRCxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNuRyxDQUFDO0lBRU8sS0FBSyxDQUFDLFFBQVE7UUFDbEIsb0JBQW9CO0lBQ3hCLENBQUM7SUFFTyxXQUFXLENBQUMsT0FBYztRQUM5QixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzFCLE1BQU0sTUFBTSxHQUFrQjtZQUMxQixRQUFRLEVBQUUsT0FBTztZQUNqQixlQUFlLEVBQUUsUUFBUSxDQUFDLFdBQVc7WUFDckMsSUFBSSxFQUFFLHVCQUFVLENBQUMsT0FBTztZQUN4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