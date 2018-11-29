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
        let results = null;
        let data = doc[config.source_field];
        if (data) {
            if (config.regex) {
                if (data && typeof data === 'string') {
                    const { regex } = config;
                    const extractedField = data.match(regex);
                    if (extractedField) {
                        const regexResult = extractedField.length === 1 ? extractedField[0] : extractedField[1];
                        if (regexResult)
                            results = lodash_1.default.set({}, config.target_field, regexResult);
                    }
                }
            }
            else if (config.start && config.end) {
                let { end } = config;
                if (end === "EOP")
                    end = '&';
                const indexStart = data.indexOf(config.start) + config.start.length;
                let endInd = data.indexOf(end);
                if (endInd === -1)
                    endInd = data.length;
                const extractedSlice = data.slice(indexStart, endInd);
                if (extractedSlice)
                    results = lodash_1.default.set({}, config.target_field, data.slice(indexStart, endInd));
            }
            else {
                results = lodash_1.default.set({}, config.target_field, data);
            }
        }
        this.results = results;
    }
    // TODO: flesh this out
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
exports.default = Transform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3dhdGNoZXIvbGliL3dhdGNoX21hbmFnZXIvdHJhbnNmb3JtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esa0RBQWdDO0FBR2hDLG9EQUF1QjtBQUV2QixnQkFBZ0I7QUFDaEIsTUFBcUIsU0FBVSxTQUFRLGNBQVU7SUFLN0MsWUFBWSxNQUF1QjtRQUMvQixLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVELFVBQVUsQ0FBQyxHQUFlO1FBQ3RCLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxPQUFPLEdBQWtCLElBQUksQ0FBQztRQUNsQyxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBRXBDLElBQUksSUFBSSxFQUFFO1lBQ04sSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO2dCQUNkLElBQUksSUFBSSxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtvQkFDbEMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sQ0FBQztvQkFDekIsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFlLENBQUMsQ0FBQztvQkFDbkQsSUFBSSxjQUFjLEVBQUU7d0JBQ2hCLE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDeEYsSUFBSSxXQUFXOzRCQUFFLE9BQU8sR0FBRSxnQkFBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQTtxQkFDeEU7aUJBQ0o7YUFDSjtpQkFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRTtnQkFDL0IsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQztnQkFDckIsSUFBSSxHQUFHLEtBQUssS0FBSztvQkFBRSxHQUFHLEdBQUcsR0FBRyxDQUFBO2dCQUM1QixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztnQkFDcEUsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDL0IsSUFBSSxNQUFNLEtBQUssQ0FBQyxDQUFDO29CQUFFLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUN4QyxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDdEQsSUFBSSxjQUFjO29CQUFFLE9BQU8sR0FBRyxnQkFBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFBO2FBQ25HO2lCQUFNO2dCQUNILE9BQU8sR0FBRyxnQkFBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQTthQUNqRDtTQUNKO1FBRUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDM0IsQ0FBQztJQUVELHVCQUF1QjtJQUN2QixVQUFVO1FBQ04sT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELE1BQU07UUFDRixNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksT0FBTyxLQUFLLElBQUk7WUFBRSxPQUFPLE9BQU8sQ0FBQztRQUNyQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM3RCxDQUFDO0NBQ0o7QUFuREQsNEJBbURDIn0=