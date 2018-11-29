"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const job_components_1 = require("@terascope/job-components");
class Schema extends job_components_1.ConvictSchema {
    build() {
        return {
            type: {
                doc: 'determines if the watcher should return the whole record or transform the returning results',
                default: 'matcher',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3dhdGNoZXIvc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsOERBQTJEO0FBRzNELE1BQXFCLE1BQU8sU0FBUSw4QkFBNEI7SUFDNUQsS0FBSztRQUNELE9BQU87WUFDSCxJQUFJLEVBQUU7Z0JBQ0YsR0FBRyxFQUFFLDZGQUE2RjtnQkFDbEcsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLE1BQU0sRUFBRSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUM7YUFDbkM7WUFDRCxTQUFTLEVBQUU7Z0JBQ1AsR0FBRyxFQUFFLGdIQUFnSDtnQkFDckgsT0FBTyxFQUFFLEVBQUU7YUFDZDtZQUNELFVBQVUsRUFBRTtnQkFDUixHQUFHLEVBQUUseUNBQXlDO2dCQUM5QyxPQUFPLEVBQUUsRUFBRTthQUNkO1lBQ0QsS0FBSyxFQUFFO2dCQUNILEdBQUcsRUFBRSx3Q0FBd0M7Z0JBQzdDLE9BQU8sRUFBRSxFQUFFO2FBQ2Q7WUFDRCxlQUFlLEVBQUU7Z0JBQ2IsR0FBRyxFQUFFLGtFQUFrRTtnQkFDdkUsT0FBTyxFQUFFLEVBQUU7YUFDZDtZQUNELE9BQU8sRUFBRTtnQkFDTCxHQUFHLEVBQUUsa0ZBQWtGO2dCQUN2RixPQUFPLEVBQUUsRUFBRTthQUNkO1NBQ0osQ0FBQTtJQUNMLENBQUM7Q0FDSjtBQTlCRCx5QkE4QkMifQ==