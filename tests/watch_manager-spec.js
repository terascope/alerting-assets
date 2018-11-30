
const path = require('path');
const WatchClass = require('../asset/src/transform/lib/watch_manager');
const WatchManager = WatchClass.default || WatchClass;

describe('watch_manager', () => {
    const matchRules1Path = path.join(__dirname, './fixtures/matchRules1.txt');
    const transformRules2Path = path.join(__dirname, './fixtures/transformRules2.txt');
    const logger = {
        info(){},
        error(){}
    };

    it('it can instantiate a matcher from file', async () => {
        const opConfig = { file_path: matchRules1Path, type: 'matcher'}
        let manager;
        expect(() => {
            manager = new WatchManager(opConfig, logger);
        }).not.toThrow()

        try{
            await manager.init();
        } catch(err) {
            fail(err)
        }
    });

    it('it can instantiate a transform with operations from file', async () => {
        const opConfig = { file_path: transformRules2Path, type: 'transform'}
        let manager;
        expect(() => {
            manager = new WatchManager(opConfig, logger);
        }).not.toThrow()

        try{
            await manager.init();
        } catch(err) {
            fail(err)
        }
    });
    
});
