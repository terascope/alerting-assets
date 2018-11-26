const opTestHarness  = require ('@terascope/teraslice-op-test-harness');
const { DataEntity } = require ('@terascope/job-components');
const path = require('path');
const Watcher = require('../asset/src/watcher');
const _ = require('lodash');

fdescribe('watcher op', () => {
    const matchRules1Path = path.join(__dirname, './fixtures/matchRules1.txt');
    const extractRules1Path = path.join(__dirname, './fixtures/extractRules1.txt');

    let opTest;

    beforeEach(() => {
        opTest = opTestHarness({ Processor: Watcher.Processor.default, Schema: Watcher.Schema.default });
    });

    xdescribe('matcher', () => {
        it('can return matching documents', async () => {
            const opConfig = {
                _op: 'watcher',
                file_path: matchRules1Path,
                type: 'matcher',
                type_config: { _created: 'date' },
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
                type_config: { _created: 'date' },
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
                type_config: { _created: 'date' },
                actions: [{ some: 'actions' }]
            }
    
            const data = DataEntity.makeArray([
                { some: 'data', bytes: 1200, _created: "2018-12-16T15:16:09.076Z" },
                { some: 'data', bytes: 200 },
                { some: 'other', bytes: 1200 }
            ]);

            const test = await opTest.init({ opConfig });
            const results =  await test.run(data);

            expect(results[0].getMetadata('selector')).toEqual([ 'some:data AND bytes:>=1000', 'other:/.*abc.*/ OR _created:>=2018-11-16T15:16:09.076Z' ])
        });
    })

    fdescribe('can transform data', () => {
        it('it can transform matching data', async () => {
            const opConfig = {
                _op: 'watcher',
                file_path: extractRules1Path,
                type: 'transform',
                type_config: { _created: 'date' },
                actions: ['someActions']
            };
    
            const data = DataEntity.makeArray([
                { some: 'data', bytes: 1200, myfield: 'hello' },
                { some: 'data', bytes: 200 },
                { some: 'other', bytes: 1200 },
                { other: 'xabcd', myfield: 'hello' },
                { _created: "2018-12-16T15:16:09.076Z", myfield: 'hello' }
            ]);

            const test = await opTest.init({ opConfig });
            const results =  await test.run(data);
    
            expect(results.length).toEqual(3);
            _.each(results, (data) => {
                expect(DataEntity.isDataEntity(data)).toEqual(true);
                expect(_.get(data, "topfield.value1")).toEqual('hello');
                expect(data.getMetadata('actions')).toEqual(opConfig.actions);
                expect(data.getMetadata('selector')).toBeDefined();
            });
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

            expect(results.length).toEqual(1)
            expect(results[0]).toEqual({ myRegex: 'something' })
        });

        xit('can merge extacted results', async () => {
            const opConfig = {
                file_path: extractRules1Path,
                type: 'transform',
                type_config: { _created: 'date' },
                actions: ['someActions']
            };
    
            const data = DataEntity.makeArray([
               
            ]);

            const test = await opTest.init({ opConfig });
            const results =  await test.run(data);
        
        });
    });
    //TODO: test validation 

});