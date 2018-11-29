import { InjectConfig } from '../../interfaces';
import { Logger } from '@terascope/job-components';
export default class PostProcessManager {
    private operationList;
    private validationList;
    private logger;
    constructor(logger: Logger);
    inject(config: InjectConfig): void;
    postProcess(selector: string, record: object): any;
    validate(selector: string, record: object): any;
}
