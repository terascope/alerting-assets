"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base"));
//TODO: need story on metadata
class Matcher extends base_1.default {
    constructor(config) {
        super(config.selector, config.selector_config);
        this.config = config;
    }
    extraction(doc) {
        this.results = doc;
    }
    validation() {
        return true;
    }
    output() {
        const { results } = this;
        if (results === null)
            return results;
        return { data: results, selector: this.config.selector };
    }
}
exports.default = Matcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvd2F0Y2hlci9saWIvd2F0Y2hfbWFuYWdlci9tYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLGtEQUFnQztBQUloQyw4QkFBOEI7QUFDOUIsTUFBcUIsT0FBUSxTQUFRLGNBQVU7SUFLM0MsWUFBWSxNQUFxQjtRQUM3QixLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVELFVBQVUsQ0FBQyxHQUFlO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxVQUFVO1FBQ04sT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU07UUFDRixNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksT0FBTyxLQUFLLElBQUk7WUFBRSxPQUFPLE9BQU8sQ0FBQztRQUNyQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0NBQ0o7QUF2QkQsMEJBdUJDIn0=