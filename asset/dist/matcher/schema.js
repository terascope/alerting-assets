"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const TransFormSchema = __importStar(require("../transform/schema"));
const job_components_1 = require("@terascope/job-components");
class Schema extends job_components_1.ConvictSchema {
    build() {
        const { context } = this;
        //@ts-ignore
        const schema = new TransFormSchema(context).build();
        schema.type.default = 'matcher';
        return schema;
    }
}
exports.default = Schema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL21hdGNoZXIvc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNBLHFFQUF1RDtBQUN2RCw4REFBMkQ7QUFHM0QsTUFBcUIsTUFBTyxTQUFRLDhCQUE0QjtJQUM1RCxLQUFLO1FBQ0QsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztRQUN6QixZQUFZO1FBQ1osTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFBO1FBQy9CLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7Q0FDSjtBQVJELHlCQVFDIn0=