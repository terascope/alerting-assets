"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const job_components_1 = require("@terascope/job-components");
const watch_manager_1 = __importDefault(require("./lib/watch_manager"));
class Watcher extends job_components_1.BatchProcessor {
    constructor(context, opConfig, executionConfig) {
        super(context, opConfig, executionConfig);
        this.watchManager = new watch_manager_1.default(opConfig, context.logger);
    }
    async initialize() {
        return this.watchManager.init();
    }
    async onBatch(data) {
        return this.watchManager.run(data);
    }
}
exports.default = Watcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3dhdGNoZXIvcHJvY2Vzc29yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsOERBQXVHO0FBRXZHLHdFQUFpRDtBQUVqRCxNQUFxQixPQUFRLFNBQVEsK0JBQTZCO0lBRzlELFlBQVksT0FBc0IsRUFBRSxRQUF1QixFQUFFLGVBQWdDO1FBQ3pGLEtBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSx1QkFBYyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDcEUsQ0FBQztJQUVELEtBQUssQ0FBQyxVQUFVO1FBQ1osT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ25DLENBQUM7SUFFRixLQUFLLENBQUMsT0FBTyxDQUFDLElBQWtCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsQ0FBQztDQUNIO0FBZkQsMEJBZUMifQ==