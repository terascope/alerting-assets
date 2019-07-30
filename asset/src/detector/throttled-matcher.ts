
import { DataEntity } from '@terascope/job-components';
import { Matcher } from 'ts-transforms';
import { DetectorConfig, DetectorRecord, WrapperThrottledRun } from './interfaces';
import throttle from 'lodash/throttle';

export default class ThrottledMatcher {
    private matcher: Matcher;
    private listId: string;
    // @ts-ignore
    private inject: WrapperThrottledRun;

    constructor(matcher: Matcher, listId: string, opConfig: DetectorConfig) {
        const { client_id: clientId, notification_throttle: timer } = opConfig;
        this.listId = listId;
        this.matcher = matcher;
        // @ts-ignore
        this.opConfig = opConfig;
        this.inject = throttle((data: DataEntity[], results: DataEntity<DetectorRecord>[]) => {
            data.forEach((record) => {
                results.push(DataEntity.make<DetectorRecord>({
                    data: record,
                    client_id: clientId,
                    list_id: this.listId
                }));
            });
        }, timer);
    }

    run(data: DataEntity[], results: DataEntity<DetectorRecord>[]) {
        const matchedRecords = this.matcher.run(data);
        if (matchedRecords.length > 0) this.inject(matchedRecords, results);
    }
}
