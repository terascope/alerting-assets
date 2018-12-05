
import { DataEntity } from '@terascope/job-components';
import { OperationConfig } from '../../interfaces';

export default abstract class PhaseBase {
    abstract run(data: DataEntity[]): DataEntity[]
}
