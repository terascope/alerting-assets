"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = __importDefault(require("../transform/schema"));
const job_components_1 = require("@terascope/job-components");
class Schema extends job_components_1.ConvictSchema {
    build() {
        const schema = new schema_1.default(this.context).build();
        schema.type.default = 'matcher';
        return schema;
    }
}
exports.default = Schema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21hdGNoL3NjaGVtYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLGlFQUFrRDtBQUNsRCw4REFBMkQ7QUFHM0QsTUFBcUIsTUFBTyxTQUFRLDhCQUE0QjtJQUM1RCxLQUFLO1FBQ0QsTUFBTSxNQUFNLEdBQUcsSUFBSSxnQkFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN6RCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7UUFDaEMsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztDQUNKO0FBTkQseUJBTUMifQ==