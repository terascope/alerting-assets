
import opTestHarness from '@terascope/teraslice-op-test-harness';
import { DataEntity, newTestExecutionConfig } from '@terascope/job-components';
import path from 'path';
import { Processor, Schema } from '../asset/src/transform';
import _ from 'lodash';

describe('can transform matches', () => {
    const testAssetPath = path.join(__dirname, './assets');
    let opTest: opTestHarness.TestHarness;
    const type = 'processor';
    const assetName = 'someAssetId';

    beforeEach(() => {
        // @ts-ignore
        opTest =  opTestHarness({ Processor, Schema });
        opTest.context.sysconfig.teraslice.assets_directory = testAssetPath;
    });

    it('it can transform matching data', async () => {
        const opConfig = {
            _op: 'transform',
            rules: [`${assetName}:transformRules1.txt`],
            types: { _created: 'date' }
        };

        const executionConfig = newTestExecutionConfig({
            assets: [assetName],
            operations: [opConfig]
        });

        const data = DataEntity.makeArray([
            { some: 'data', bytes: 200, myfield: 'hello' },
            { some: 'data', bytes: 200 },
            { some: 'other', bytes: 1200 },
            { other: 'xabcd', myfield: 'hello' },
            { _created: '2018-12-16T15:16:09.076Z', myfield: 'hello' }
        ]);

        const test = await opTest.init({ executionConfig, type });
        const results =  await test.run(data);

        expect(results.length).toEqual(1);
        // @ts-ignore
        _.each(results, (data:DataEntity) => {
            expect(DataEntity.isDataEntity(data)).toEqual(true);
            expect(_.get(data, 'topfield.value1')).toEqual('hello');
            expect(data.getMetadata('selectors')).toBeDefined();
        });
    });

    it('can uses typeConifg', async () => {
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
            { hostname: 'www.other.com', location: '33.435967,  -111.867710 ' }, // true
            { hostname: 'www.example.com', location: '22.435967,-150.867710' }  // false
        ]);

        const test = await opTest.init({ executionConfig, type });
        const results =  await test.run(data);

        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({ point: data[0].location });
    });

    it('it can transform matching data with no selector', async () => {
        const opConfig = {
            _op: 'transform',
            rules: [`${assetName}:transformRules3.txt`],
        };

        const executionConfig = newTestExecutionConfig({
            assets: [assetName],
            operations: [opConfig]
        });

        const data = DataEntity.makeArray([
           { data: 'someData' },
           { data: 'otherData' },
           {}
        ]);
        const resultSet = data.map(obj => obj.data);
        const test = await opTest.init({ executionConfig, type });
        const results =  await test.run(data);

        expect(results.length).toEqual(2);
        // @ts-ignore
        _.each(results, (data:DataEntity, index) => {
            expect(DataEntity.isDataEntity(data)).toEqual(true);
            expect(data.other).toEqual(resultSet[index]);
            expect(data.getMetadata('selectors')['*']).toBeDefined();
        });
    });

    it('can work with regex transform queries', async () => {
        const opConfig = {
            _op: 'transform',
            rules: [`${assetName}:transformRules1.txt`],
        };

        const executionConfig = newTestExecutionConfig({
            assets: [assetName],
            operations: [opConfig]
        });

        const data = DataEntity.makeArray([
            { some: 'data', someField: 'something' },
            { some: 'data', someField: 'otherthing' },   // should not return anyting
            { some: 'data' },    // should not return anyting
        ]);

        const test = await opTest.init({ executionConfig, type });
        const results =  await test.run(data);
        // NOTE:   'regex': 'some.*?$' will give you the entire matched string => wholeRegexResponse
        // NOTE:   'regex': 'some(.*?)$' will give you the captured part of the string => partRegexResponse

        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({ wholeRegexResponse: 'something', partRegexResponse: 'thing' });
    });

    it('can extract using start/end', async () => {
        const opConfig = {
            _op: 'transform',
            rules: [`${assetName}:transformRules1.txt`],
        };

        const executionConfig = newTestExecutionConfig({
            assets: [assetName],
            operations: [opConfig]
        });

        const data1 = DataEntity.makeArray([
            { some: 'data', bytes: 1200 , myfield: 'http://google.com?field1=helloThere&other=things' },
        ]);

        const data2 = DataEntity.makeArray([
                { some: 'data', bytes: 1200 , myfield: 'http://google.com?field1=helloThere' },
        ]);

        const test = await opTest.init({ executionConfig, type });
        const results1 =  await test.run(data1);

        expect(results1.length).toEqual(1);
        expect(results1[0]).toEqual({ topfield: { value1: 'helloThere' } });

        const results2 =  await test.run(data2);

        expect(results2.length).toEqual(1);
        expect(results2[0]).toEqual({ topfield: { value1: 'helloThere' } });
    });

    it('can merge extacted results', async () => {
        const opConfig = {
            _op: 'transform',
            rules: [`${assetName}:transformRules1.txt`],
        };

        const executionConfig = newTestExecutionConfig({
            assets: [assetName],
            operations: [opConfig]
        });

        const data = DataEntity.makeArray([
            { hostname: 'www.example.com', pathLat: '/path/tiles/latitude/33.435967', pathLon: '/path/tiles/longitude/-111.867710' }, // true
            { hostname: 'www.other.com', location: '33.435967,  -111.867710 ' }, // false
            { hostname: 'www.example.com', location: '22.435967,-150.867710' }  // false
        ]);

        const test = await opTest.init({ executionConfig, type });
        const results =  await test.run(data);

        expect(results.length).toEqual(2);
        expect(results[0]).toEqual({ location: { lat: '33.435967', lon: '-111.867710' } });
        expect(results[1]).toEqual({ point: '33.435967,  -111.867710 ' });
    });

    it('can use post process operations', async () => {
        const opConfig = {
            _op: 'transform',
            rules: [`${assetName}:transformRules2.txt`]
        };

        const executionConfig = newTestExecutionConfig({
            assets: [assetName],
            operations: [opConfig]
        });

        const data = DataEntity.makeArray([
            { hello: 'world', first: 'John', last: 'Doe' }
        ]);

        const test = await opTest.init({ executionConfig, type });
        const results =  await test.run(data);

        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({ full_name: 'John Doe' });
    });

    it('false validations remove the fields', async () => {
        const opConfig = {
            _op: 'transform',
            rules: [`${assetName}:transformRules2.txt`],
        };

        const executionConfig = newTestExecutionConfig({
            assets: [assetName],
            operations: [opConfig]
        });

        const data = DataEntity.makeArray([
            { geo: true, lat: '2233', other: 'data' },
            { geo: true, lon: '2233' }
        ]);

        const data2 = DataEntity.makeArray([
            { geo: true, lat: '2233' },
            { geo: true, lon: '2233' }
        ]);

        const test = await opTest.init({ executionConfig, type });
        const results =  await test.run(data);

        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({ other: 'data' });

        const results2 =  await test.run(data2);
        expect(results2).toEqual([]);
    });

    it('refs can target the right field', async () => {
        const opConfig = {
            _op: 'transform',
            rules: [`${assetName}:transformRules4.txt`],
        };

        const executionConfig = newTestExecutionConfig({
            assets: [assetName],
            operations: [opConfig]
        });

        const data = DataEntity.makeArray([
            { hello: 'world', lat: 23.423, lon: 93.33, first: 'John', last: 'Doe' }, // all good
            { hello: 'world', lat: 123.423, lon: 93.33, first: 'John', last: 'Doe' }, // bad geo
            { hello: 'world', lat: 123.423, lon: 93.33, first: 'John', last: 'Doe' }, // bad geo
            { hello: 'world', lat: 23.423, lon: 93.33, full_name: 3243423 } // full_name is not string
        ]);

        const resultSet = [
            { location: { lat: 23.423, lon: 93.33 }, first_name: 'John', last_name: 'Doe', full_name: 'John Doe' },
            { first_name: 'John', last_name: 'Doe', full_name: 'John Doe' },
            { first_name: 'John', last_name: 'Doe', full_name: 'John Doe' },
            { location: { lat: 23.423, lon: 93.33 } }
        ];

        const test = await opTest.init({ executionConfig, type });
        const results =  await test.run(data);
        // @ts-ignore
        _.each(results, (data:DataEntity, index) => {
            expect(DataEntity.isDataEntity(data)).toEqual(true);
            expect(data).toEqual(resultSet[index]);
            expect(data.getMetadata('selectors')).toBeDefined();
        });
    });

    it('can chain selection => transform => selection', async() => {
        const opConfig = {
            _op: 'transform',
            rules: [`${assetName}:transformRules5.txt`],
        };

        const executionConfig = newTestExecutionConfig({
            assets: [assetName],
            operations: [opConfig]
        });

        const data = DataEntity.makeArray([
            { hello: 'world',  first: 'John', last: 'Doe' },
            { hello: 'world',  first: 'Jane', last: 'Austin' },
            { hello: 'world',  first: 'Jane', last: 'Doe' },
            { hello: 'world' }
        ]);

        const test = await opTest.init({ executionConfig, type });
        const results = await test.run(data);

        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({ first_name: 'Jane', last_name: 'Doe', full_name: 'Jane Doe' });
        // @ts-ignore
        const metaData = results[0].getMetadata();
        expect(metaData.selectors).toEqual({ 'hello:world': true, 'full_name:"Jane Doe"': true });
    });

    it('can chain selection => transform => selection => transform', async() => {
        const opConfig = {
            _op: 'transform',
            rules: [`${assetName}:transformRules6.txt`],

        };

        const executionConfig = newTestExecutionConfig({
            assets: [assetName],
            operations: [opConfig]
        });

        const data = DataEntity.makeArray([
            { hello: 'world',  first: 'John', last: 'Doe' },
            { hello: 'world',  first: 'Jane', last: 'Austin' },
            { hello: 'world',  first: 'Jane', last: 'Doe' },
            { hello: 'world' }
        ]);

        const test = await opTest.init({ executionConfig, type });
        const results =  await test.run(data);

        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({ first_name: 'Jane', full_name: 'Jane Doe', last_name: 'Doe', name: 'Jane Doe' });

        // @ts-ignore
        const metaData = results[0].getMetadata();
        expect(metaData.selectors).toEqual({ 'hello:world': true, 'full_name:"Jane Doe"': true });
    });

    it('can work with plugins', async() => {
        const opConfig = {
            _op: 'transform',
            rules: [`${assetName}:transformRulesTag.txt`],
            plugins: [`${assetName}:plugins`]
        };

        const executionConfig = newTestExecutionConfig({
            assets: [assetName],
            operations: [opConfig]
        });

        const key = '123456789';

        const data = DataEntity.makeArray([
            { host: 'example.com', field1: `http://www.example.com/path?field1=${key}&value2=moreblah&value3=evenmoreblah` },
            { host: 'example.com' },
            { host: 'example.com', field1: 'someRandomStr' },
            { host: 'example.com', field1: ['someRandomStr', `http://www.example.com/path?field1=${key}&value2=moreblah&value3=evenmoreblah`] },
            { size: 2 }
        ]);

        const test = await opTest.init({ executionConfig, type });
        const results =  await test.run(data);

        expect(results.length).toEqual(2);
        expect(results[0]).toEqual({
            field1: key,
            wasTagged: true
        });
        expect(results[1]).toEqual({
            field1: [key],
            wasTagged: true
        });
    });
});
