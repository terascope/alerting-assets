
import { DataEntity } from '@terascope/job-components';

export default class Tag {
     // @ts-ignore
    constructor(operationConfig) {
        // @ts-ignore
        this.operationConfig = operationConfig;
    }

    run(doc: DataEntity) {
        doc.wasTagged = true;
        return doc;
    }
}
