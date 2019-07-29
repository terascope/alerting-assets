
import { WorkerContext, BatchProcessor, ExecutionConfig, DataEntity, getClient } from '@terascope/job-components';
import { Matcher } from 'ts-transforms';
import { ACLManager } from '@terascope/data-access';
import { DataType } from '@terascope/data-types';
// import debounce from 'lodash/debounce';
import { DetectorConfig } from './interfaces';
import { ListManager, List } from '../lists';

interface Matchers {
    [key: string]: Matcher;
}

interface DetectorRecord extends DataEntity {
    data: DataEntity;
    client_id: string;
    list_id: string;
}

// class 

// TODO: does this need a flush event?

export default class Detector extends BatchProcessor<DetectorConfig> {
    private listManager!: ListManager;
    private aclManager!: ACLManager;
    private matchers: Matchers = {};
    private waitTimer!: number;
    private canRun: boolean = false;

    constructor(context: WorkerContext, opConfig: DetectorConfig, executionConfig: ExecutionConfig) {
        super(context, opConfig, executionConfig);
    }

    async initialize() {
        const {
            data_access_namespace: dataAccessNameSpace,
            space_name: spaceName,
            connection,
            client_id: clientId,
            subscription_timer: timer,
            wait_timer: waitTimer
        } = this.opConfig;

        this.waitTimer = waitTimer;

        const aclConfig = { namespace: dataAccessNameSpace, logger: this.logger };
        const listConfig = { namespace: spaceName, logger: this.logger };

        const client = getClient(this.context, { connection }, 'elasticsearch');
        this.aclManager = new ACLManager(client, aclConfig);
        this.listManager = new ListManager(client, listConfig, this.aclManager);
        // everything is unsubscribed on listManager.shutdown
        await this.listManager.subscribe(clientId, this.setupMatcher.bind(this), timer);
    }

    private async _getDataTypes(id: string) {
        const { data_type: dataTypeId } = await this.aclManager.findSpace({ id }, false);
        const { config } = await this.aclManager.findDataType({ id: dataTypeId }, false);
        return config;
    }

    async setupMatcher(lists: List[]) {
        this.canRun = false;
        const dataTypesConfigs = await Promise.all(lists.map(list => this._getDataTypes(list.space)));
        const dataTypes = dataTypesConfigs.map(config => new DataType(config).toXlucene());

        for (const [index, list] of lists.entries()) {
            const matcherConfig = { notification_rules: list.list, types: dataTypes[index] };
            this.matchers[list.id] = new Matcher(matcherConfig, this.logger);
            await this.matchers[list.id].init();
        }

        this.canRun = true;
    }

    async shutdown() {
        await this.listManager.shutdown();
    }

    private async _canRun () {
        if (this._canRun) return true;
        return new Promise((resolve) => {
            const timer = setInterval(() => {
                if (this.canRun) {
                    clearInterval(timer);
                    resolve(true);
                }
            }, this.waitTimer);
        });
    }

    async onBatch(data: DataEntity[]): Promise<DataEntity<DetectorRecord>[]> {
        const results:DataEntity<DetectorRecord>[] = [];

        await this._canRun();

        for (const [listId, matcher] of Object.entries(this.matchers)) {
            const matchedRecords = matcher.run(data);
            // TODO: put delay here
            matchedRecords.forEach((record) => {
                results.push(DataEntity.make<DetectorRecord>({
                    data: record,
                    client_id: this.opConfig.client_id,
                    list_id: listId
                }));
            });
        }

        return results;
    }
}
