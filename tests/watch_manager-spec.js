
const OpTestHarness  = require ('@terascope/teraslice-op-test-harness');
const { DataEntity } = require ('@terascope/job-components');
const path = require('path');
const WatchClass = require('../asset/src/watcher/lib/watch_manager');
const WatchManager = WatchClass.default || WatchClass;


describe('watch_manager', () => {
    const matchRules1Path = path.join(__dirname, './fixtures/matchRules1.txt');

    it('it can instantiate a matcher from file', async () => {
        const opConfig = { file_path: matchRules1Path, type: 'matcher'}
        let manager;
        expect(() => {
            manager = new WatchManager(opConfig);
        }).not.toThrow()

        try{
            await manager.init();
        } catch(err) {
            fail(err)
        }
    });

    it('it can match across against data', async () => {
        const opConfig = {
            file_path: matchRules1Path,
            type: 'matcher',
            type_config: { _created: 'date' },
        };
        const manager = new WatchManager(opConfig);

        const data = DataEntity.makeArray([
            { some: 'data', bytes: 1200 },
            { some: 'data', bytes: 200 },
            { some: 'other', bytes: 1200 },
            { other: 'xabcd' },
            { _created: "2018-12-16T15:16:09.076Z" }
        ]);
        await manager.init();

        const results = manager.run(data);
        expect(results.length).toEqual(3)
    });

    it('it add metadata to returning docs', async () => {
        const opConfig = {
            file_path: matchRules1Path,
            type: 'matcher',
            type_config: { _created: 'date' },
            actions: [{ some: 'actions' }]
        }
        const manager = new WatchManager(opConfig);

        const data = DataEntity.makeArray([
            { some: 'data', bytes: 1200 },
            { some: 'data', bytes: 200 },
            { some: 'other', bytes: 1200 },
            { other: 'xabcd' },
            { _created: "2018-12-16T15:16:09.076Z" }
        ]);
        await manager.init();

        const results = manager.run(data);

        expect(results.length).toEqual(3)
        results.forEach((doc) => {
            expect(doc.getMetadata('actions')).toEqual(opConfig.actions);
            expect(doc.getMetadata('selector')).toBeDefined();
        })
    });
});
