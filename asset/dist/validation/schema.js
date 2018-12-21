"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const job_components_1 = require("@terascope/job-components");
class Schema extends job_components_1.ConvictSchema {
    validate(input) {
        const validatedSchema = super.validate(input);
        if (!input.file_path && !input.index)
            throw new Error('you must either specify a file path or the index to retrive the rules for this op');
        return validatedSchema;
    }
    build() {
        return {
            file_path: {
                doc: 'if specified it will load the rules off of a file. It expects each configuration to be seperated by a new line',
                default: '',
                format: 'optional_String'
            },
            connection: {
                doc: 'which elasticsearch client will be used',
                default: '',
                format: 'optional_String'
            },
            index: {
                doc: 'which elasticsearch index will be used',
                default: '',
                format: 'optional_String'
            },
            selector_config: {
                doc: 'if specified it sets describes the types on the incoming records',
                default: {}
            }
        };
    }
}
exports.default = Schema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZhbGlkYXRpb24vc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsOERBQTJEO0FBRzNELE1BQXFCLE1BQU8sU0FBUSw4QkFBNEI7SUFFNUQsUUFBUSxDQUFDLEtBQVU7UUFDZixNQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUs7WUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLG1GQUFtRixDQUFDLENBQUM7UUFDM0ksT0FBTyxlQUFlLENBQUM7SUFDM0IsQ0FBQztJQUNELEtBQUs7UUFDRCxPQUFPO1lBQ0gsU0FBUyxFQUFFO2dCQUNQLEdBQUcsRUFBRSxnSEFBZ0g7Z0JBQ3JILE9BQU8sRUFBRSxFQUFFO2dCQUNYLE1BQU0sRUFBRSxpQkFBaUI7YUFDNUI7WUFDRCxVQUFVLEVBQUU7Z0JBQ1IsR0FBRyxFQUFFLHlDQUF5QztnQkFDOUMsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsTUFBTSxFQUFFLGlCQUFpQjthQUM1QjtZQUNELEtBQUssRUFBRTtnQkFDSCxHQUFHLEVBQUUsd0NBQXdDO2dCQUM3QyxPQUFPLEVBQUUsRUFBRTtnQkFDWCxNQUFNLEVBQUUsaUJBQWlCO2FBQzVCO1lBQ0QsZUFBZSxFQUFFO2dCQUNiLEdBQUcsRUFBRSxrRUFBa0U7Z0JBQ3ZFLE9BQU8sRUFBRSxFQUFFO2FBQ2Q7U0FDSixDQUFDO0lBQ04sQ0FBQztDQUNKO0FBOUJELHlCQThCQyJ9