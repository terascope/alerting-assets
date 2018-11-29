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
const post_process_manager_1 = __importDefault(require("../post_process_manager"));
const lodash_1 = __importDefault(require("lodash"));
class WatcherManager {
    constructor(opConfig) {
        this.watcherList = [];
        this.opConfig = opConfig;
        this.loader = this.determineLoader(opConfig);
        this.postProcessManager = new post_process_manager_1.default();
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
            selector_config: opConfig.selector_config,
            type: interfaces_1.NotifyType.matcher,
            actions: opConfig.actions
        };
        this.watcherList.push(new match_1.default(config));
    }
    loadExtractor(_config) {
        const { opConfig } = this;
        const lineConfig = JSON.parse(_config);
        const config = lodash_1.default.assign({}, {
            type: interfaces_1.NotifyType.extraction,
            actions: opConfig.actions,
            selector_config: opConfig.selector_config
        }, lineConfig);
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
            rl.on('line', () => loader);
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
                    type.extraction(doc);
                    //TODO: how should we handle validation issues
                    type.validation(doc);
                    const output = type.output();
                    if (output !== null) {
                        data.hasMatch = true;
                        data.selector.push(output.selector);
                        data.results = lodash_1.default.merge(data.results, output.data);
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
exports.default = WatcherManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvd2F0Y2hlci9saWIvd2F0Y2hfbWFuYWdlci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLDhEQUF1RDtBQUN2RCxvREFBOEI7QUFDOUIsNENBQW9CO0FBQ3BCLHdEQUFnQztBQUNoQyxpREFBdUc7QUFDdkcsNERBQW9DO0FBQ3BDLG1GQUF5RDtBQUN6RCxvREFBdUI7QUFFdkIsTUFBcUIsY0FBYztJQUsvQixZQUFZLFFBQXVCO1FBQy9CLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSw4QkFBa0IsRUFBRSxDQUFBO0lBQ3RELENBQUM7SUFFTyxlQUFlLENBQUMsUUFBdUI7UUFDM0MsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztTQUN6QjtRQUNELElBQUksUUFBUSxDQUFDLFVBQVUsSUFBSSxRQUFRLENBQUMsS0FBSyxFQUFFO1lBQ3ZDLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN4QjtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsb0RBQW9ELElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ25HLENBQUM7SUFFTyxLQUFLLENBQUMsUUFBUTtRQUNsQixvQkFBb0I7SUFDeEIsQ0FBQztJQUVPLFdBQVcsQ0FBQyxPQUFjO1FBQzlCLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDMUIsTUFBTSxNQUFNLEdBQWtCO1lBQzFCLFFBQVEsRUFBRSxPQUFPO1lBQ2pCLGVBQWUsRUFBRSxR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