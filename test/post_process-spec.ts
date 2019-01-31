
import opTestHarness from '@terascope/teraslice-op-test-harness';
import { DataEntity, newTestExecutionConfig } from '@terascope/job-components';
import path from 'path';
import { Processor, Schema } from '../asset/src/post_process';
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

    it('can run and post_process data', async () => {
        const opConfig = {
            _op: 'transform',
            rules: [`${assetName}:transformRules2.txt`]
        };

        const executionConfig = newTestExecutionConfig({
            assets: [assetName],
            operations: [opConfig]
        });

        const data = [
            new DataEntity({ first_name: 'John', last_name: 'Doe' }, { selectors: { 'hello:world': true } }),
            new DataEntity({ first_name: 'Jane', last_name: 'Doe' }, { selectors: { 'other:key': true } }),
        ];

        const test = await opTest.init({ executionConfig, type });
        const results = await test.run(data);

        expect(results.length).toEqual(2);
        expect(results[0]).toEqual({ first_name: 'John', last_name: 'Doe', full_name: 'John Doe' });
        expect(results[1]).toEqual(data[1]);
    });
});
