
import OperationBase from './lib/base'
import Join from './lib/ops/join';
import Selector from './lib/ops/selector';
import Transform  from './lib/ops/transform';
import Geolocation from './lib/validations/geolocation';

const opNames = {
    join: Join,
    selector: Selector,
    transform: Transform,
    geolocation: Geolocation
};

export {
    OperationBase,
    Join,
    Selector,
    Transform,
    Geolocation,
    opNames
};