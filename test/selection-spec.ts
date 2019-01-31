
import opTestHarness from '@terascope/teraslice-op-test-harness';
import { DataEntity, newTestExecutionConfig } from '@terascope/job-components';
import path from 'path';
import { Processor, Schema } from '../asset/src/selection';
import _ from 'lodash';

describe('extraction phase', () => {
    const testAssetPath = path.join(__dirname, './assets');
    let opTest: opTestHarness.TestHarness;
    const type = 'processor';
    const assetName = 'someAssetId';

    beforeEach(() => {
        opTest =  opTestHarness({ Processor, Schema });
        opTest.context.sysconfig.teraslice.assets_directory = testAssetPath;
    });

    it('can run and select data', async () => {
        const opConfig = {
            _op: 'transform',
            rules: [`${assetName}:transformRules1.txt`],
            types: { location: 'geo' }
        };

        const executionConfig = newTestExecutionConfig({
            assets: [assetName],
            operations: [opConfig]
        });

        const data = DataEntity.makeArray([
            { some: 'data', isTall: true },
            { some: 'thing else', person: {} },
            { hostname: 'www.example.com', bytes: 1000 },
            { location: '33.435967,-111.867710', zip: 94302 },
            {}
        ]);

        const test = await opTest.init({ executionConfig, type });
        const results = await test.run(data);

        expect(results.length).toEqual(3);
        expect(results[0]).toEqual(data[0]);
        expect(results[1]).toEqual(data[2]);
        expect(results[2]).toEqual(data[3]);
    });
});
