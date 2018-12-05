
import { DataEntity } from '@terascope/job-components';

export default abstract class OperationBase {
    abstract run(data: DataEntity): null | DataEntity | object
}
