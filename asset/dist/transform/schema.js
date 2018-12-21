"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const job_components_1 = require("@terascope/job-components");
class Schema extends job_components_1.ConvictSchema {
    build() {
        return {
            type: {
                doc: 'determines if the watcher should return the whole record or transform the returning results',
                default: 'transform',
                format: ['matcher', 'transform']
            },
            file_path: {
                doc: 'if specified it will load the rules off of a file. It expects each configuration to be seperated by a new line',
                default: ''
            },
            connection: {
                doc: 'which elasticsearch client will be used',
                default: ''
            },
            index: {
                doc: 'which elasticsearch index will be used',
                default: ''
            },
            selector_config: {
                doc: 'if specified it sets describes the types on the incoming records',
                default: {}
            },
            actions: {
                doc: 'if specified it sets describes the actions that should occur on matching records',
                default: []
            }
        };
    }
}
exports.default = Schema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RyYW5zZm9ybS9zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw4REFBMkQ7QUFHM0QsTUFBcUIsTUFBTyxTQUFRLDhCQUE0QjtJQUM1RCxLQUFLO1FBQ0QsT0FBTztZQUNILElBQUksRUFBRTtnQkFDRixHQUFHLEVBQUUsNkZBQTZGO2dCQUNsRyxPQUFPLEVBQUUsV0FBVztnQkFDcEIsTUFBTSxFQUFFLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQzthQUNuQztZQUNELFNBQVMsRUFBRTtnQkFDUCxHQUFHLEVBQUUsZ0hBQWdIO2dCQUNySCxPQUFPLEVBQUUsRUFBRTthQUNkO1lBQ0QsVUFBVSxFQUFFO2dCQUNSLEdBQUcsRUFBRSx5Q0FBeUM7Z0JBQzlDLE9BQU8sRUFBRSxFQUFFO2FBQ2Q7WUFDRCxLQUFLLEVBQUU7Z0JBQ0gsR0FBRyxFQUFFLHdDQUF3QztnQkFDN0MsT0FBTyxFQUFFLEVBQUU7YUFDZDtZQUNELGVBQWUsRUFBRTtnQkFDYixHQUFHLEVBQUUsa0VBQWtFO2dCQUN2RSxPQUFPLEVBQUUsRUFBRTthQUNkO1lBQ0QsT0FBTyxFQUFFO2dCQUNMLEdBQUcsRUFBRSxrRkFBa0Y7Z0JBQ3ZGLE9BQU8sRUFBRSxFQUFFO2FBQ2Q7U0FDSixDQUFDO0lBQ04sQ0FBQztDQUNKO0FBOUJELHlCQThCQyJ9