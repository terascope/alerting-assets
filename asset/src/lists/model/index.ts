
import * as es from 'elasticsearch';
import { IndexModel, IndexModelOptions } from 'elasticsearch-store';
import { List } from '../interfaces';
import listConfig from './config';

export default class Lists extends IndexModel<List> {
    static indexModelConfig = listConfig;

    constructor(client: es.Client, config: IndexModelOptions) {
        super(client, config, listConfig);
    }
}

export { List };