"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const job_components_1 = require("@terascope/job-components");
const ts_transforms_1 = require("ts-transforms");
const path_1 = __importDefault(require("path"));
class Watcher extends job_components_1.BatchProcessor {
    constructor(context, opConfig, executionConfig) {
        super(context, opConfig, executionConfig);
        this.operationsManager = new ts_transforms_1.PhaseManager(opConfig, context.logger);
    }
    async initialize() {
        const assetPath = await this.context.apis.assets.getPath('alerting-assets');
        const filePath = path_1.default.join(assetPath, this.opConfig.file_path);
        const newOpConfig = Object.assign({}, this.opConfig, { file_path: filePath });
        this.operationsManager = new ts_transforms_1.PhaseManager(newOpConfig, this.logger);
        return this.operationsManager.init();
    }
    async onBatch(data) {
        return this.operationsManager.run(data);
    }
}
exports.default = Watcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RyYW5zZm9ybS9wcm9jZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSw4REFBdUc7QUFFdkcsaURBQTZDO0FBQzdDLGdEQUF3QjtBQUV4QixNQUFxQixPQUFRLFNBQVEsK0JBQTZCO0lBRzlELFlBQVksT0FBc0IsRUFBRSxRQUF1QixFQUFFLGVBQWdDO1FBQ3pGLEtBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLDRCQUFZLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUN2RSxDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVU7UUFDWixNQUFNLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUM1RSxNQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQW1CLENBQUMsQ0FBQztRQUN6RSxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksNEJBQVksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3BFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLElBQWtCO1FBQzVCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQ0o7QUFuQkQsMEJBbUJDIn0=