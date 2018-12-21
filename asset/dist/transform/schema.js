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
            rules_file: {
                doc: 'if specified it will load the rules off of a file. It expects each configuration to be seperated by a new line',
                default: '',
                format: 'optinal_String'
            },
            asset_name: {
                doc: 'if specified it will load the rules off of a file. It expects each configuration to be seperated by a new line',
                default: 'alerting-assets',
                format: 'optinal_String'
            },
            connection: {
                doc: 'which elasticsearch client will be used',
                default: '',
                format: 'optinal_String'
            },
            index: {
                doc: 'which elasticsearch index will be used',
                default: '',
                format: 'optinal_String'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RyYW5zZm9ybS9zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw4REFBMkQ7QUFHM0QsTUFBcUIsTUFBTyxTQUFRLDhCQUE0QjtJQUM1RCxLQUFLO1FBQ0QsT0FBTztZQUNILElBQUksRUFBRTtnQkFDRixHQUFHLEVBQUUsNkZBQTZGO2dCQUNsRyxPQUFPLEVBQUUsV0FBVztnQkFDcEIsTUFBTSxFQUFFLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQzthQUNuQztZQUNELFVBQVUsRUFBRTtnQkFDUixHQUFHLEVBQUUsZ0hBQWdIO2dCQUNySCxPQUFPLEVBQUUsRUFBRTtnQkFDWCxNQUFNLEVBQUUsZ0JBQWdCO2FBQzNCO1lBQ0QsVUFBVSxFQUFFO2dCQUNSLEdBQUcsRUFBRSxnSEFBZ0g7Z0JBQ3JILE9BQU8sRUFBRSxpQkFBaUI7Z0JBQzFCLE1BQU0sRUFBRSxnQkFBZ0I7YUFDM0I7WUFDRCxVQUFVLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLHlDQUF5QztnQkFDOUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsTUFBTSxFQUFFLGdCQUFnQjthQUMzQjtZQUNELEtBQUssRUFBRTtnQkFDSCxHQUFHLEVBQUUsd0NBQXdDO2dCQUM3QyxPQUFPLEVBQUUsRUFBRTtnQkFDWCxNQUFNLEVBQUUsZ0JBQWdCO2FBQzNCO1lBQ0QsZUFBZSxFQUFFO2dCQUNiLEdBQUcsRUFBRSxrRUFBa0U7Z0JBQ3ZFLE9BQU8sRUFBRSxFQUFFO2FBQ2Q7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsR0FBRyxFQUFFLGtGQUFrRjtnQkFDdkYsT0FBTyxFQUFFLEVBQUU7YUFDZDtTQUNKLENBQUM7SUFDTixDQUFDO0NBQ0o7QUF0Q0QseUJBc0NDIn0=