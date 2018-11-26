
const path = require('path');
const WatchClass = require('../asset/src/watcher/lib/watch_manager');
const WatchManager = WatchClass.default || WatchClass;

describe('watch_manager', () => {
    const matchRules1Path = path.join(__dirname, './fixtures/matchRules1.txt');
    const extractules1Path = path.join(__dirname, './fixtures/extractRules1.txt');

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
});
