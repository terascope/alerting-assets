const opTestHarness  = require ('@terascope/teraslice-op-test-harness');
const { DataEntity } = require ('@terascope/job-components');
const path = require('path');
const Watcher = require('../asset/src/watcher');
const _ = require('lodash');

describe('watcher op', () => {
    const matchRules1Path = path.join(__dirname, './fixtures/matchRules1.txt');
    const extractRules1Path = path.join(__dirname, './fixtures/extractRules1.txt');
    const extractRules2Path = path.join(__dirname, './fixtures/extractRules2.txt');

    let opTest;

    beforeEach(() => {
        opTest = opTestHarness({ Processor: Watcher.Processor.default, Schema: Watcher.Schema.default });
    });

    describe('matcher', () => {
        it('can return matching documents', async () => {
            const opConfig = {
                _op: 'watcher',
                file_path: matchRules1Path,
                type: 'matcher',
                selector_config: { _created: 'date' },
            };
    
            const data = DataEntity.makeArray([
                { some: 'data', bytes: 1200 },
                { some: 'data', bytes: 200 },
                { some: 'other', bytes: 1200 },
                { other: 'xabcd' },
                { _created: "2018-12-16T15:16:09.076Z" }
            ]);
    
            const test = await opTest.init({ opConfig });
            const results =  await test.run(data);

            expect(results.length).toEqual(3);
        });

        it('it add metadata to returning docs', async () => {
            const opConfig = {
                _op: 'watcher',
                file_path: matchRules1Path,
                type: 'matcher',
                selector_config: { _created: 'date' },
                actions: [{ some: 'actions' }]
            };
    
            const data = DataEntity.makeArray([
                { some: 'data', bytes: 1200 },
                { some: 'data', bytes: 200 },
                { some: 'other', bytes: 1200 },
                { other: 'xabcd' },
                { _created: "2018-12-16T15:16:09.076Z" }
            ]);

            const test = await opTest.init({ opConfig });
            const results =  await test.run(data);
    
            expect(results.length).toEqual(3)
            results.forEach((doc) => {
                expect(doc.getMetadata('actions')).toEqual(opConfig.actions);
                expect(doc.getMetadata('selector')).toBeDefined();
            })
        });

        it('it can match multiple rules', async () => {
            const opConfig = {
                _op: 'watcher',
                file_path: matchRules1Path,
                type: 'matcher',
                selector_config: { _created: 'date' },
                actions: [{ some: 'actions' }]
            }
    
            const data = DataEntity.makeArray([
                { some: 'data', bytes: 1200, _created: "2018-12-16T15:16:09.076Z" },
                { some: 'data', bytes: 200 },
                { some: 'other', bytes: 1200 }
            ]);

            const test = await opTest.init({ opConfig });
            const results =  await test.run(data);
            // each match will be inserted into the results
            expect(results.length).toEqual(2);
            expect(results[0].getMetadata('selector')).toEqual('some:data AND bytes:>=1000');
            expect(results[1].getMetadata('selector')).toEqual('other:/.*abc.*/ OR _created:>=2018-11-16T15:16:09.076Z');
        });
    })

    describe('can transform data', () => {
        it('it can transform matching data', async () => {
            const opConfig = {
                _op: 'watcher',
                file_path: extractRules1Path,
                type: 'transform',
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
                file_path: extractRules1Path,
                type: 'transform',
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
                file_path: extractRules1Path,
                type: 'transform',
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
                file_path: extractRules1Path,
                type: 'transform',
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
                file_path: extractRules1Path,
                type: 'transform',
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
                file_path: extractRules2Path,
                type: 'transform',
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
                file_path: extractRules2Path,
                type: 'transform',
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
    //TODO: test validation 
});