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
    }
    async initialize() {
        const assetPath = await this.context.apis.assets.getPath(this.opConfig.asset_name);
        const filePath = path_1.default.join(assetPath, this.opConfig.rules_file);
        const newOpConfig = Object.assign({}, this.opConfig, { file_path: filePath });
        const loader = new ts_transforms_1.Loader(newOpConfig);
        const configList = await loader.load();
        this.phase = new ts_transforms_1.SelectionPhase(newOpConfig, configList);
    }
    async onBatch(data) {
        return this.phase.run(data);
    }
}
exports.default = Watcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlbGVjdGlvbi9wcm9jZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSw4REFBdUc7QUFFdkcsaURBQXVEO0FBQ3ZELGdEQUF3QjtBQUV4QixNQUFxQixPQUFRLFNBQVEsK0JBQTZCO0lBRzlELFlBQVksT0FBc0IsRUFBRSxRQUF1QixFQUFFLGVBQWdDO1FBQ3pGLEtBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVTtRQUNaLE1BQU0sU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQW9CLENBQUMsQ0FBQztRQUM3RixNQUFNLFFBQVEsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQW9CLENBQUMsQ0FBQztRQUMxRSxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDOUUsTUFBTSxNQUFNLEdBQUcsSUFBSSxzQkFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sVUFBVSxHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSw4QkFBYyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFrQjtRQUM1QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDSjtBQW5CRCwwQkFtQkMifQ==