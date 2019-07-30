
import { ConvictSchema }  from '@terascope/job-components';
import { DetectorConfig } from './interfaces';

export default class Schema extends ConvictSchema<DetectorConfig> {
    build() {
        return {
            client_id: {
                doc: 'the client_id to fetch lists',
                default: 1,
                format: Number
            },
            connection: {
                doc: 'the data access connection to use',
                default: 'default',
                format: String
            },
            data_access_namespace: {
                doc: 'Elasticsearch index namespace for the data-access models',
                default: '',
                format: 'required_String',
            },
            space_name: {
                doc: 'Name of space where lists resides',
                default: '',
                format: 'required_String',
            },
            notification_throttle: {
                doc: `The time in "ms" that will elapse between the same list notification.
                IE if list "A" sends an alert, then list "A" will not be able to alert again until the time specified passes.  defaults to 10mins`,
                default: 10 * 60 * 1000,
            },
            subscription_timer: {
                doc: 'The time in "ms" when it will check for changes in Lists, defaults to 10mins',
                default: 10 * 60 * 1000,
            },
            wait_timer: {
                doc: 'The time in "ms" interval for the processor to see if it can continue running after updating lists ',
                default: 100,
            },
        };
    }
}
