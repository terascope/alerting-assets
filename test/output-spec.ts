
import opTestHarness from '@terascope/teraslice-op-test-harness';
import { DataEntity, newTestExecutionConfig } from '@terascope/job-components';
import path from 'path';
import { Processor, Schema } from '../asset/src/output';
import _ from 'lodash';

describe('extraction phase', () => {
    const testAssetPath = path.join(__dirname, './assets');
    let opTest: opTestHarness.TestHarness;
    const type = 'processor';
    const assetName = 'someAssetId';

    beforeEach(() => {
        // @ts-ignore
        opTest =  opTestHarness({ Processor, Schema });
        opTest.context.sysconfig.teraslice.assets_directory = testAssetPath;
    });

    it('can run and validate data', async () => {
        const opConfig = {
            _op: 'transform',
            rules: [`${assetName}:transformRules16.txt`]
        };
        const date = new Date().toISOString();

        const executionConfig = newTestExecutionConfig({
            assets: [assetName],
            operations: [opConfig]
        });

        const data = [
            new DataEntity({ some: 'data', date }, { selectors: { 'fc2.com': true } }),
            new DataEntity({ date }, { selectors: { 'fc2.com': true } }),
        ];

        const test = await opTest.init({ executionConfig, type });
        const results = await test.run(data);

        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({ some: 'data', date });
    });
});
