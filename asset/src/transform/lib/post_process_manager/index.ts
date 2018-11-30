
import { InjectConfig } from '../../interfaces';
import operations from '../operations';
import validations from '../validations';
import { Logger } from '@terascope/job-components';
import _ from 'lodash';

export default class PostProcessManager {
    private operationList: object
    private validationList: object
    private logger: Logger;

    constructor(logger: Logger) {
        this.operationList = {};
        this.validationList = {};
        this.logger = logger;
    }
    
    inject(config: InjectConfig) {
        if (config.validation) {
            const validationOp = validations[config.validation];
            if (!validationOp) throw new Error(`could not find validation module ${config.validation}`);
            const action = validationOp(config);

            if (!this.validationList[config.selector]) {
                this.validationList[config.selector] = [action]
            } else {
                this.validationList[config.selector].push(action)
            }
        }
        if (config.operation) {
            const processOp = operations[config.operation];
            if (!processOp) throw new Error(`could not find post_process module ${config.operation}`);
            const action = processOp(config);

            if (!this.operationList[config.selector]) {
                this.operationList[config.selector] = [action]
            } else {
                this.operationList[config.selector].push(action)
            }
        }
    }

    run(selector: string, record: object): null | object {
        const data = this.postProcess(selector, record);
        const validData = this.validate(selector, data);
        if (_.isEmpty(validData)) return null;
        return validData;
    }

    private postProcess(selector: string, record: object) {
        if (this.operationList[selector]) {
            return this.operationList[selector].reduce((data: object, op: Function) => {
                try {
                   return op(data);
                } catch(err) {
                    // @ts-ignore
                    this.logger.error(`could not execute op:${op.name} with data: ${JSON.stringify(data)}`);
                    return data;
                }
            }, record)
        }
        return record; 
    }
    //TODO: need better types around validation and postProcess fn interfaces to return something
    private validate(selector: string, record: object) {
        if (this.validationList[selector]) {
            return this.validationList[selector].reduce((data: object, op: Function) => {
                try {
                   return op(data);
                } catch(err) {
                    // @ts-ignore
                    this.logger.error(`could not execute validation:${op.name} with data: ${JSON.stringify(data)}`);
                    // TODO: maybe delete failed validated field here??
                    return data;
                }
            }, record)
        }
        return record; 
    }
}