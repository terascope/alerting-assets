
import path from 'path';
import _ from 'lodash';
import { WatcherConfig } from  './transform/interfaces';

type getPath = (name: string) => Promise<string>;

async function formatPaths(getPath: getPath, paths: string[]) {
    const splitPaths = paths.map(path => path.split(':'));
    const assetPaths = splitPaths.map((arr) => getPath(arr[0]));
    const results = await Promise.all(assetPaths);
    return results.map((assetPath, ind) => {
        return path.join(assetPath, splitPaths[ind][1]);
    });
}

export default async function loadResources(opConfig: WatcherConfig, getPaths: getPath) {
    let plugins;

    if (opConfig.rules) {
        const rules = await formatPaths(getPaths, opConfig.rules);
        _.assign(opConfig, { rules });
    }

    if (opConfig.plugins) {
        const pluginPaths = await formatPaths(getPaths, opConfig.plugins);
        _.assign(opConfig, { plugins: pluginPaths });
        plugins = pluginPaths.map((pPath) => {
            const myPlugin = require(pPath);
            // if es6 import default, else use regular node required obj
            return _.get(myPlugin, 'default', myPlugin);
        });
    }
    return { opConfig, plugins };
}
