
import opTestHarness from '@terascope/teraslice-op-test-harness';
import { DataEntity, newTestExecutionConfig } from '@terascope/job-components';
import path from 'path';
import { Processor, Schema } from '../asset/src/extraction';
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

    it('can run and extract data', async () => {
        const opConfig = {
            _op: 'transform',
            rules: [`${assetName}:transformRules1.txt`],
            types: { _created: 'date' }
        };

        const executionConfig = newTestExecutionConfig({
            assets: [assetName],
            operations: [opConfig]
        });

        const data = [
            { some: 'data',  bytes: 367, myfield: 'something' },
            { other: 'zabc', myfield: 'field1=something' },
            { some: 'data', someField: 'something' },
            { hostname: 'www.example.com', pathLat: '/path/tiles/latitude/53.453', pathLon: '/path/tiles/longitude/46.343' },
            { location: '33.242, -111.453' }
        ];

        const metaArray = [
            { selectors: { 'some:data AND bytes:<=1000': true, other: 'things' } },
            { selectors: { 'other:/.*abc.*/ OR _created:>=2018-11-16T15:16:09.076Z': true, someSpecialKey: true } },
            { selectors: { 'some:data': true, date: new Date().toISOString() } },
            { selectors: { 'hostname:www.example.com': true } },
            { selectors: { 'location:(_geo_box_top_left_: \"33.906320,  -112.758421\" _geo_box_bottom_right_:\"32.813646,-111.058902\")': true } }
        ];

        const resultsArray = [
            { topfield: { value1: 'something' } },
            { topfield: { value1: 'something' } },
            { wholeRegexResponse: 'something', partRegexResponse: 'thing' },
            { location: { lat: '53.453', lon: '46.343' } },
            { point: '33.242, -111.453' }
        ];

        const dataArray = data.map((obj, ind) => new DataEntity(obj, metaArray[ind]));

        const test = await opTest.init({ executionConfig, type });
        const results = await test.run(dataArray);

        expect(results.length).toEqual(5);
        // @ts-ignore
        results.forEach((result, ind) => {
            expect(result).toEqual(resultsArray[ind]);
            expect(result.getMetadata('selectors')).toEqual(metaArray[ind].selectors);
        });
    });
});
