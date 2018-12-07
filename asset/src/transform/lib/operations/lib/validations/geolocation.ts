
import OperationBase from '../base';
import { DataEntity } from '@terascope/job-components';
import { OperationConfig } from '../../../../interfaces'
import _ from 'lodash';

export default class Geolocation implements OperationBase {
    private source: string

    constructor(config: OperationConfig) {
        this.validate(config);
        const field = config.target_field as string;
        this.source = field.lastIndexOf('.') === -1 ?
            field : field.slice(0, field.lastIndexOf('.'))
    }

    private validate(config: OperationConfig) {
        const { target_field: field } = config;
        if (!field || typeof field !== 'string' || field.length === 0) throw new Error(`could not find target_field for geolocation validation or it is improperly formatted, config: ${JSON.stringify(config)}`)
    }

    run(data: DataEntity | null): DataEntity | null {
        if (!data) return data;
        const { source } = this;
        const geoData = _.get(data, source);
        let hasError = true;
        if (!geoData) return data;

        if (typeof geoData === 'string') {
            hasError = false;
            const pieces = geoData.split(',').map(str => Number(str));
            if (pieces.length !== 2) hasError = true;
            if (pieces[0] > 90 || pieces[0] < -90) hasError = true;
            if (pieces[1] > 180 || pieces[1] < -180) hasError = true;
        }

        if (typeof geoData === 'object') {
            hasError = false;
            const lat = geoData.lat | geoData.latitude;
            const lon = geoData.lon | geoData.longitude;
            if (!lat || (lat > 90 || lat < -90)) hasError = true;
            if (!lon || (lon > 180 || lon < -180)) hasError = true;
        }

        if (hasError) _.unset(data, source);
        return data;
    }
}
