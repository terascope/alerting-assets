
import * as es from 'elasticsearch';
import { IndexModel, IndexModelOptions } from 'elasticsearch-store';
import listConfig, { List } from './config';

export default class Lists extends IndexModel<List> {
    static indexModelConfig = listConfig;

    constructor(client: es.Client, config: IndexModelOptions) {
        super(client, config, listConfig);
    }
}

export { List };
