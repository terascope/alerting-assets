
import path from 'path';
import { get } from '@terascope/job-components';
import { PhaseConfig } from  './transform/interfaces';

type getPath = (name: string) => Promise<string>;

async function formatPaths(getPath: getPath, paths: string[]) {
    const splitPaths = paths.map(path => path.split(':'));
    const assetPaths = splitPaths.map((arr) => getPath(arr[0]));
    const results = await Promise.all(assetPaths);
    return results.map((assetPath, ind) => {
        return path.join(assetPath, splitPaths[ind][1]);
    });
}

export async function loadResources(opConfig: PhaseConfig, getPaths: getPath) {
    let plugins;

    if (opConfig.rules) {
        const rules = await formatPaths(getPaths, opConfig.rules);
        Object.assign(opConfig, { rules });
    }

    if (opConfig.plugins) {
        const pluginPaths = await formatPaths(getPaths, opConfig.plugins);
        Object.assign(opConfig, { plugins: pluginPaths });
        plugins = pluginPaths.map((pPath) => {
            const myPlugin = require(pPath);
            // if es6 import default, else use regular node required obj
            return get(myPlugin, 'default', myPlugin);
        });
    }
    return { opConfig, plugins };
}
