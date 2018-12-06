
import OperationBase from './lib/base'
import Join from './lib/ops/join';
import Selector from './lib/ops/selector';
import Transform  from './lib/ops/transform';
import Geolocation from './lib/validations/geolocation';
import String from './lib/validations/string';

const opNames = {
    join: Join,
    selector: Selector,
    transform: Transform,
    geolocation: Geolocation,
    string: String
};

export {
    OperationBase,
    Join,
    Selector,
    Transform,
    Geolocation,
    String,
    opNames
};