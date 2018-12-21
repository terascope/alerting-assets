
import opTestHarness from '@terascope/teraslice-op-test-harness';
//import { DataEntity } from '@terascope/job-components';
import path from 'path';
import { Processor, Schema } from '../asset/src/matcher';

describe('matcher', () => {
    const testAssetPath = path.join(__dirname, './assets');
    //@ts-ignore
    let opTest: opTestHarness;

    beforeEach(() => {
        opTest = opTestHarness({ Processor, Schema });
        opTest.context.sysconfig.teraslice.assets_directory = testAssetPath;
    });

    // it('can return matching documents', async () => {
    //     //TODO: file path needs to be from asset
    //     const opConfig = {
    //         _op: 'watcher',
    //         file_path: 'matchRules1.txt',
    //         selector_config: { _created: 'date' }
    //     };

    //     const executionConfig = {
    //         assets: ['someAssetId'],
    //         operations: [ opConfig ]
    //     };

    //     const data = DataEntity.makeArray([
    //         { some: 'data', bytes: 1200 },
    //         { some: 'data', bytes: 200 },
    //         { some: 'other', bytes: 1200 },
    //         { other: 'xabcd' },
    //         { _created: "2018-12-16T15:16:09.076Z" }
    //     ]);

    //     const test = await opTest.init({ executionConfig });
    //     const results =  await test.run(data);

    //     expect(results.length).toEqual(3);
    // });

    // it('it add metadata to returning docs', async () => {
    //     const opConfig = {
    //         _op: 'watcher',
    //         file_path: 'matchRules1.txt',
    //         selector_config: { _created: 'date' }
    //     };

    //     const executionConfig = {
    //         assets: ['someAssetId'],
    //         operations: [ opConfig ]
    //     };

    //     const data = DataEntity.makeArray([
    //         { some: 'data', bytes: 1200 },
    //         { some: 'data', bytes: 200 },
    //         { some: 'other', bytes: 1200 },
    //         { other: 'xabcd' },
    //         { _created: "2018-12-16T15:16:09.076Z" }
    //     ]);

    //     const test = await opTest.init({ executionConfig });
    //     const results =  await test.run(data);

    //     expect(results.length).toEqual(3)
    //     results.forEach((doc: DataEntity) => expect(doc.getMetadata('selectors')).toBeDefined());
    // });

    // it('it can match multiple rules', async () => {
    //     const opConfig = {
    //         _op: 'watcher',
    //         file_path: 'matchRules1.txt',
    //         selector_config: { _created: 'date' }
    //     };

    //     const executionConfig = {
    //         assets: ['someAssetId'],
    //         operations: [ opConfig ]
    //     };

    //     const data = DataEntity.makeArray([
    //         { some: 'data', bytes: 1200, _created: "2018-12-16T15:16:09.076Z" },
    //         { some: 'data', bytes: 200 },
    //         { some: 'other', bytes: 1200 }
    //     ]);

    //     const rules = {
    //         'some:data AND bytes:>=1000': true,
    //         'other:/.*abc.*/ OR _created:>=2018-11-16T15:16:09.076Z': true
    //     };

    //     const test = await opTest.init({ executionConfig });
    //     const results =  await test.run(data);
    //     // each match will be inserted into the results
    //     expect(results.length).toEqual(1);
    //     expect(results[0].getMetadata('selectors')).toEqual(rules);
    // });
})