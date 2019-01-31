
import opTestHarness from '@terascope/teraslice-op-test-harness';
import { DataEntity, newTestExecutionConfig } from '@terascope/job-components';
import path from 'path';
import { Processor, Schema } from '../asset/src/validation';
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

    it('can run and validate data', async () => {
        const opConfig = {
            _op: 'transform',
            rules: [`${assetName}:transformRules4.txt`]
        };

        const executionConfig = newTestExecutionConfig({
            assets: [assetName],
            operations: [opConfig]
        });

        const data = [
            new DataEntity({ full_name: 'John Doe' }, { selectors: { 'hello:world': true } }),
            new DataEntity({ full_name: true }, { selectors: { 'hello:world': true } }),
        ];

        const test = await opTest.init({ executionConfig, type });
        const results = await test.run(data);

        expect(results.length).toEqual(2);
        expect(results[0]).toEqual({ full_name: 'John Doe' });
        expect(results[1]).toEqual({ full_name: 'true' });
    });
});
