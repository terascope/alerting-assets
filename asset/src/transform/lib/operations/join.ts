
import { JoinConfig } from '../../interfaces';
import _ from 'lodash';

export default function join(config: JoinConfig) {
    return (data: object) => {
        const delimiter = config.delimiter !== undefined ? config.delimiter : '';
        const fields = config.fields.map(field => _.get(data, field));
        const results = fields.join(delimiter);
        if (config.remove_source) {
            const final = {}
            final[config.target_field] = results;
            return final;
        }
        data[config.target_field] = results;
        return data;
    }
}