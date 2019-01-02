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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Bvc3RfcHJvY2Vzcy9zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw4REFBMkQ7QUFHM0QsTUFBcUIsTUFBTyxTQUFRLDhCQUE0QjtJQUU1RCxRQUFRLENBQUMsS0FBVTtRQUNmLE1BQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsbUZBQW1GLENBQUMsQ0FBQztRQUMzSSxPQUFPLGVBQWUsQ0FBQztJQUMzQixDQUFDO0lBQ0QsS0FBSztRQUNELE9BQU87WUFDSCxTQUFTLEVBQUU7Z0JBQ1AsR0FBRyxFQUFFLGdIQUFnSDtnQkFDckgsT0FBTyxFQUFFLEVBQUU7Z0JBQ1gsTUFBTSxFQUFFLGlCQUFpQjthQUM1QjtZQUNELFVBQVUsRUFBRTtnQkFDUixHQUFHLEVBQUUseUNBQXlDO2dCQUM5QyxPQUFPLEVBQUUsRUFBRTtnQkFDWCxNQUFNLEVBQUUsaUJBQWlCO2FBQzVCO1lBQ0QsS0FBSyxFQUFFO2dCQUNILEdBQUcsRUFBRSx3Q0FBd0M7Z0JBQzdDLE9BQU8sRUFBRSxFQUFFO2dCQUNYLE1BQU0sRUFBRSxpQkFBaUI7YUFDNUI7WUFDRCxlQUFlLEVBQUU7Z0JBQ2IsR0FBRyxFQUFFLGtFQUFrRTtnQkFDdkUsT0FBTyxFQUFFLEVBQUU7YUFDZDtTQUNKLENBQUM7SUFDTixDQUFDO0NBQ0o7QUE5QkQseUJBOEJDIn0=