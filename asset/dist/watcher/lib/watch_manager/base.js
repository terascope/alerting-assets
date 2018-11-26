"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xlucene_evaluator_1 = require("xlucene-evaluator");
class FilterBase {
    constructor(luceneQuery, typeConfigs) {
        this.documentMatcher = new xlucene_evaluator_1.DocumentMatcher(luceneQuery, typeConfigs);
    }
    match(doc) {
        return this.documentMatcher.match(doc);
    }
}
exports.default = FilterBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy93YXRjaGVyL2xpYi93YXRjaF9tYW5hZ2VyL2Jhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx5REFBb0Q7QUFJcEQsTUFBOEIsVUFBVTtJQUdwQyxZQUFZLFdBQW1CLEVBQUUsV0FBb0I7UUFDakQsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLG1DQUFlLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFBO0lBQ3hFLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBZTtRQUNqQixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNDLENBQUM7Q0FLSjtBQWRELDZCQWNDIn0=