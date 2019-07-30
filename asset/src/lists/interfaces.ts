
// import { AnyObject } from '@terascope/job-components';
import { IndexModelRecord } from 'elasticsearch-store';

export interface EmailConfig {
    body?: string;
    to: string[];
    bcc?: string[];
    from: string;
    ffrom?: string;
    subject: string;
}

export interface Email {
    type: 'EMAIL';
    config: EmailConfig;
}

export interface WebHook {
    type: 'WEBHOOK';
    config: {
        message?: string;
        url: string;
        token: string;
    };
}
// TODO: currently we only support EMAIL
export type Notifications = Email;

export interface List extends IndexModelRecord {
    list: string;
    active: boolean;
    users: string[];
    name: string;
    notifications: Notifications[];
    description?: string;
    space: string;
}

export interface ListDict {
    [key: string]: List;
}

export interface SubscriptionCleanup {
    unsubscribe: () => void;
}

export interface TimerDict {
    [key: string]: NodeJS.Timeout;
}

export type subscriptionCb = (lists: List[]) => void;
