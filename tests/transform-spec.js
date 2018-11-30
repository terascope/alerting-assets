const opTestHarness  = require ('@terascope/teraslice-op-test-harness');
const { DataEntity } = require ('@terascope/job-components');
const path = require('path');
const Transform = require('../asset/src/transform');
const _ = require('lodash');

fdescribe('can transform matches', () => {

    const transformRules1Path = path.join(__dirname, './fixtures/transformRules1.txt');
    const transformRules2Path = path.join(__dirname, './fixtures/transformRules2.txt');

    let opTest;

    beforeEach(() => {
        opTest = opTestHarness({ Processor: Transform.Processor.default, Schema: Transform.Schema.default });
    });

    fit('it can transform matching data', async () => {
        const opConfig = {
            _op: 'watcher',
            file_path: transformRules1Path,
            selector_config: { _created: 'date' },
            actions: ['someActions']
        };

        const data = DataEntity.makeArray([
            { some: 'data', bytes: 200, myfield: 'hello' },
            { some: 'data', bytes: 200 },
            { some: 'other', bytes: 1200 },
            { other: 'xabcd', myfield: 'hello' },
            { _created: "2018-12-16T15:16:09.076Z", myfield: 'hello' }
        ]);

        const test = await opTest.init({ opConfig });
        const results =  await test.run(data);

        expect(results.length).toEqual(1);
        _.each(results, (data) => {
            expect(DataEntity.isDataEntity(data)).toEqual(true);
            expect(_.get(data, "topfield.value1")).toEqual('hello');
            expect(data.getMetadata('actions')).toEqual(opConfig.actions);
            expect(data.getMetadata('selector')).toBeDefined();
        });
    });

    it('can uses typeConifg', async () => {
        const opConfig = {
            _op: 'watcher',
            file_path: transformRules1Path,
            selector_config: { location: 'geo' },
            actions: ['someActions']
        };

        const data = DataEntity.makeArray([
            { hostname: "www.other.com", location: '33.435967,  -111.867710 ' }, // true
            { hostname: "www.example.com", location: '22.435967,-150.867710' }  // false
        ]);

        const test = await opTest.init({ opConfig });
        const results =  await test.run(data);

        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({ point: data[0].location });
    });

    it('can work with regex transform queries', async () => {
        const opConfig = {
            _op: 'watcher',
            file_path: transformRules1Path,
            actions: ['someActions']
        };

        const data = DataEntity.makeArray([
            { some: 'data', someField: 'something' },
            { some: 'data', someField: 'otherthing' },   // should not return anyting
            { some: 'data' },    // should not return anyting
        ]);

        const test = await opTest.init({ opConfig });
        const results =  await test.run(data);
        // NOTE:   "regex": "some.*?$" will give you the entire matched string => wholeRegexResponse
        // NOTE:   "regex": "some(.*?)$" will give you the captured part of the string => partRegexResponse

        expect(results.length).toEqual(1)
        expect(results[0]).toEqual({ wholeRegexResponse: 'something', partRegexResponse: 'thing' })
    });

    it('can extract using start/end', async () => {
        const opConfig = {
            _op: 'watcher',
            file_path: transformRules1Path,
            actions: ['someActions']
        };

        const data1 = DataEntity.makeArray([
            { some: 'data', bytes: 1200 , myfield: 'http://google.com?field1=helloThere&other=things'},
        ]);

        const data2 = DataEntity.makeArray([
            { some: 'data', bytes: 1200 , myfield: 'http://google.com?field1=helloThere'},
            ]);

        const test = await opTest.init({ opConfig });
        const results1 =  await test.run(data1);

        expect(results1.length).toEqual(1);
        expect(results1[0]).toEqual({ topfield: { value1: 'helloThere' } });

        const results2 =  await test.run(data1);

        expect(results2.length).toEqual(1);
        expect(results2[0]).toEqual({ topfield: { value1: 'helloThere' } });
    });

    it('can merge extacted results', async () => {
        const opConfig = {
            _op: 'watcher',
            file_path: transformRules1Path,
            actions: ['someActions']
        };

        const data = DataEntity.makeArray([
            { hostname: "www.example.com", pathLat: '/path/tiles/latitude/33.435967', pathLon: '/path/tiles/longitude/-111.867710' }, // true
            { hostname: "www.other.com", location: '33.435967,  -111.867710 ' }, // false
            { hostname: "www.example.com", location: '22.435967,-150.867710' }  // false
        ]);

        const test = await opTest.init({ opConfig });
        const results =  await test.run(data);

        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({ location: { lat: '33.435967', lon: '-111.867710' } })
    });

    it('can use post process operations', async () => {
        const opConfig = {
            _op: 'watcher',
            file_path: transformRules2Path,
            actions: ['someActions']
        };

        const data = DataEntity.makeArray([
            { hello: 'world', first: 'John', last: 'Doe'}
        ]);

        const test = await opTest.init({ opConfig });
        const results =  await test.run(data);

        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({ full_name: 'John Doe'})
    });

    it('false validations remove the fields', async () => {
        const opConfig = {
            _op: 'watcher',
            file_path: transformRules2Path,
            actions: ['someActions']
        };

        const data = DataEntity.makeArray([
            { geo: true, lat: '2233', other: 'data'},
            { geo: true, lon: '2233'}
        ]);

        const data2 = DataEntity.makeArray([
            { geo: true, lat: '2233'},
            { geo: true, lon: '2233'}
        ]);

        const test = await opTest.init({ opConfig });
        const results =  await test.run(data);

        expect(results.length).toEqual(1);
        expect(results[0]).toEqual({ other: 'data' });

        const results2 =  await test.run(data2);
        expect(results2).toEqual([]);
    })

});
