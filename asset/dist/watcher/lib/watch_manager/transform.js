"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base"));
const lodash_1 = __importDefault(require("lodash"));
//TODO: fix this
class Transform extends base_1.default {
    constructor(config) {
        super(config.selector, config.selector_config);
        this.config = config;
    }
    extraction(doc) {
        const { config } = this;
        //console.log('the config in extraction', config)
        const results = {};
        let data = doc[config.source_field];
        lodash_1.default.set(results, config.target_field, data);
        // const results = {};
        this.results = results;
    }
    // TODO: flesh this out
    validation() {
        return true;
    }
    output() {
        const { results } = this;
        return { data: results, selector: this.config.selector };
    }
}
exports.default = Transform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3dhdGNoZXIvbGliL3dhdGNoX21hbmFnZXIvdHJhbnNmb3JtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esa0RBQWdDO0FBR2hDLG9EQUF1QjtBQUV2QixnQkFBZ0I7QUFDaEIsTUFBcUIsU0FBVSxTQUFRLGNBQVU7SUFLN0MsWUFBWSxNQUF1QjtRQUMvQixLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVELFVBQVUsQ0FBQyxHQUFlO1FBQ3RCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDeEIsaURBQWlEO1FBQ2pELE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXBDLGdCQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ3pDLHNCQUFzQjtRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMzQixDQUFDO0lBRUQsdUJBQXVCO0lBQ3ZCLFVBQVU7UUFDTixPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsTUFBTTtRQUNGLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDekIsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0QsQ0FBQztDQUNKO0FBOUJELDRCQThCQyJ9