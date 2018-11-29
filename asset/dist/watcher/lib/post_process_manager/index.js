"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const operations_1 = __importDefault(require("../operations"));
const validations_1 = __importDefault(require("../validations"));
class PostProcessManager {
    constructor(logger) {
        this.operationList = {};
        this.validationList = {};
        this.logger = logger;
    }
    inject(config) {
        if (config.validation) {
            const validationOp = validations_1.default[config.validation];
            if (!validationOp)
                throw new Error(`could not find validation module ${config.validation}`);
            const action = validationOp(config);
            if (!this.validationList[config.selector]) {
                this.validationList[config.selector] = [action];
            }
            else {
                this.validationList[config.selector].push(action);
            }
        }
        if (config.operation) {
            const processOp = operations_1.default[config.operation];
            if (!processOp)
                throw new Error(`could not find post_process module ${config.operation}`);
            const action = processOp(config);
            if (!this.operationList[config.operation]) {
                this.operationList[config.operation] = [action];
            }
            else {
                this.operationList[config.operation].push(action);
            }
        }
    }
    postProcess(selector, record) {
        if (this.operationList[selector]) {
            return this.operationList[selector].reduce((data, op) => {
                try {
                    return op(data);
                }
                catch (err) {
                    // @ts-ignore
                    this.logger.error(`could not execute op:${op.name} with data: ${JSON.stringify(data)}`);
                    return data;
                }
            }, record);
        }
        return record;
    }
    validate(selector, record) {
        if (this.validationList[selector]) {
            return this.validationList[selector].reduce((data, op) => {
                try {
                    return op(data);
                }
                catch (err) {
                    // @ts-ignore
                    this.logger.error(`could not execute validation:${op.name} with data: ${JSON.stringify(data)}`);
                    return data;
                }
            }, record);
        }
        return record;
    }
}
exports.default = PostProcessManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvd2F0Y2hlci9saWIvcG9zdF9wcm9jZXNzX21hbmFnZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSwrREFBdUM7QUFDdkMsaUVBQXlDO0FBSXpDLE1BQXFCLGtCQUFrQjtJQUtuQyxZQUFZLE1BQWM7UUFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFvQjtRQUN2QixJQUFJLE1BQU0sQ0FBQyxVQUFVLEVBQUU7WUFDbkIsTUFBTSxZQUFZLEdBQUcscUJBQVcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLFlBQVk7Z0JBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFDNUYsTUFBTSxNQUFNLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXBDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDdkMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTthQUNsRDtpQkFBTTtnQkFDSCxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7YUFDcEQ7U0FDSjtRQUNELElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUNsQixNQUFNLFNBQVMsR0FBRyxvQkFBVSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMsU0FBUztnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztZQUMxRixNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFakMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUN2QyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2FBQ2xEO2lCQUFNO2dCQUNILElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTthQUNwRDtTQUNKO0lBQ0wsQ0FBQztJQUVELFdBQVcsQ0FBQyxRQUFnQixFQUFFLE1BQWM7UUFDeEMsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzlCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFZLEVBQUUsRUFBWSxFQUFFLEVBQUU7Z0JBQ3RFLElBQUk7b0JBQ0QsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2xCO2dCQUFDLE9BQU0sR0FBRyxFQUFFO29CQUNULGFBQWE7b0JBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsQ0FBQyxJQUFJLGVBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ3hGLE9BQU8sSUFBSSxDQUFDO2lCQUNmO1lBQ0wsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1NBQ2I7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsUUFBUSxDQUFDLFFBQWdCLEVBQUUsTUFBYztRQUNyQyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDL0IsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQVksRUFBRSxFQUFZLEVBQUUsRUFBRTtnQkFDdkUsSUFBSTtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDbEI7Z0JBQUMsT0FBTSxHQUFHLEVBQUU7b0JBQ1QsYUFBYTtvQkFDYixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxnQ0FBZ0MsRUFBRSxDQUFDLElBQUksZUFBZSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDaEcsT0FBTyxJQUFJLENBQUM7aUJBQ2Y7WUFDTCxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUE7U0FDYjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7Q0FDSjtBQWpFRCxxQ0FpRUMifQ==