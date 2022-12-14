#!/usr/bin/env node
require('./modules/Array.js');
const {setTimeout} =  require('timers/promises');
const logFactory = require('./modules/logFactory.js'),
    CCKDisplay = require('./modules/CCKDisplay.js'),
    Demo = require('./Demo.js');

const log = logFactory.create('Demo');
const config = require('../config.json');  //TODO: Convert main.js to use yargs

//const DEV_FILE = '/dev/rpmsg_pru30';
const TWO_SECONDS = 2 * 1000,
    //FIVE_SECONDS = 5 * 1000,
    TEN_SECONDS = 10 * 1000,
    TOTAL_FLASH_TIME = TEN_SECONDS,
    TOTAL_ANIMATION_TIME = TEN_SECONDS;

config.cckConfig.logger = log;
let cck = new CCKDisplay(config.cckConfig),
    demo = new Demo(cck);

[
    async function Init() {
        log.info('Init');
        cck.allSegmentsOff();
        return setTimeout(TWO_SECONDS);
    },
    async function(no) {
        log.info(`ATMOF-2159 Demo #${no}\n\tAll display segments off.`);
        cck.allSegmentsOff();
        return setTimeout(TWO_SECONDS);
    },
    async function(no) {
        log.info(`ATMOF-2159 Demo #${no}`);
        log.info('\tAll display segments flashing red.');

        return demo.allErrorFlashing(TOTAL_FLASH_TIME);
    },
    async function(no) {
        log.info(`ATMOF-2159 Demo #${no}`);
        log.info('\tDisplay segment flashing green.');

        return demo.displayFlashing(0, 255, 0, TOTAL_FLASH_TIME);
    },
    async function(no) {
        log.info(`ATMOF-2159 Demo #${no}`);
        log.info('\tScanner segment flashing green.');

        return demo.scannerFlashing(0, 255, 0, TOTAL_FLASH_TIME);
    },
    async function(no) {
        log.info(`ATMOF-2159 Demo #${no}`);
        log.info('\tPresenter segment flashing green.');

        return demo.presenterFlashing(0, 255, 0, TOTAL_FLASH_TIME);
    },
    async function(no) {
        log.info(`ATMOF-2159 Demo #${no}`);
        log.info('\tPresenter segment flashing yellow one second intervals. One second intervals is the default for flashing anyway.');

        return demo.presenterFlashing(128, 128, 0, TOTAL_FLASH_TIME);
    },
    async function(no) {
        log.info(`ATMOF-2159 Demo #${no}`);
        log.info('\tAnimation from all green to yellow to red as CCK counts down from 10s to retract check.');
        return demo.checkRetractTimer(TOTAL_ANIMATION_TIME);
    },
    async function Cleanup() {
        log.info('Clean up.');
        return setTimeout(0).then(cck.allSegmentsOff.bind(cck));
    }
].chain((f, i)=>f(i));
