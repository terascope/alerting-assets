
import { TSError } from '@terascope/job-components';
import { Notifications, EmailConfig } from './interfaces';

function areStrings(list: string[]) {
    if (list.length === 0) return false;
    for (const str of list) {
        if (!str || typeof str !== 'string' || str.length === 0) {
            return false;
        }
    }
    return true;
}

function validateEmail(config: EmailConfig) {
    const {
        subject, from, ffrom, to, bcc, body
    } = config;

    if (!areStrings([subject, from])) {
        throw new TSError('Email must have a "subject"/"from" field and must be of type string', { statusCode: 422 });
    }

    if (!areStrings(to)) {
        throw new TSError('Email must have a "to" from and must be an array of strings', { statusCode: 422 });
    }

    if (bcc && !areStrings(bcc)) {
        throw new TSError('Email "bcc" must be an array of strings', { statusCode: 422 });
    }

    if (body && !areStrings([body])) {
        throw new TSError('Email "body" must be a string', { statusCode: 422 });
    }

    if (ffrom && !areStrings([ffrom])) {
        throw new TSError('Email "ffrom" must be a string', { statusCode: 422 });
    }
}

export function validateNotifications(notifications: Notifications[]) {
    const options = {
        EMAIL: validateEmail
    };

    if (!notifications || notifications.length === 0) throw new TSError('Empty notifications field in list', { statusCode: 422 });

    for (const nConfig of notifications) {
        if (!nConfig.type || typeof nConfig.type !== 'string' || typeof nConfig.config !== 'object') {
            throw new TSError('Notifications configurations must have a "type" and "config" field and be formatted correctly', { statusCode: 422 });
        }
        const validator = options[nConfig.type];
        if (!validator) throw new TSError(`Notifications list cannot process unknown type "${nConfig.type}"`, { statusCode: 422 });
        validator(nConfig.config);
    }

}
