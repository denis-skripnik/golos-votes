require("./js_modules/ajax");
const work = require("./js_modules/work");
const helpers = require("./js_modules/helpers");
const methods = require("./js_modules/methods");
const bdb = require("./js_modules/blocksdb");
const conf = require("./config.json");
const LONG_DELAY = 12000;
const SHORT_DELAY = 3000;
const SUPER_LONG_DELAY = 1000 * 60 * 15;

let PROPS = null;

let bn = 0;
let last_bn = 0;
let delay = SHORT_DELAY;

async function getNullTransfers() {
    PROPS = await methods.getProps();
            const block_n = await bdb.getBlock(PROPS.last_irreversible_block_num);
bn = block_n.last_block;

delay = SHORT_DELAY;
while (true) {
    try {
        if (bn > PROPS.last_irreversible_block_num) {
            // console.log("wait for next blocks" + delay / 1000);
            await helpers.sleep(delay);
            PROPS = await methods.getProps();
        } else {
            if(0 < await work.processBlock(bn)) {
                delay = SHORT_DELAY;
            } else {
                delay = LONG_DELAY;
            }
            bn++;
            await bdb.updateBlock(bn);
        }
    } catch (e) {
        console.log("error in work loop" + e);
        await helpers.sleep(1000);
        }
    }
}

setInterval(() => {
    if(last_bn == bn) {

        try {
                process.exit(1);
        } catch(e) {
            process.exit(1);
        }
    }
    last_bn = bn;
}, SUPER_LONG_DELAY);

getNullTransfers()
methods.updateAccount(conf.posting_key, conf.login);