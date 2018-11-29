
import { TransformConfig } from '../../interfaces'
import _ from 'lodash';

export default function geolocation(config: TransformConfig) {
    const { target_field: field } = config;
    const newSource = field.lastIndexOf('.') === -1 ?
        field : field.slice(0, field.lastIndexOf('.'))
        //TODO: should we support geohashes and geo arrays here?
    return (data: object) => {
        const geoData = _.get(data, newSource);
        let hasError = false;
        if (!geoData) return data;

        if (typeof geoData === 'string') {
            const pieces = geoData.split(',').map(str => Number(str));
            if (pieces.length !== 2) hasError = true;
            if (pieces[0] > 90 || pieces[0] < -90) hasError = true;
            if (pieces[1] > 180 || pieces[1] < -180) hasError = true;
        }

        if (typeof geoData === 'object') {
            const lat = geoData.lat | geoData.latitude;
            const lon = geoData.lon | geoData.longitude;
            if (!lat || (lat > 90 || lat < -90)) hasError = true;
            if (!lon || (lon > 180 || lon < -180)) hasError = true;
        }

        if (hasError) _.unset(data, newSource);
        return data;
    }
}
