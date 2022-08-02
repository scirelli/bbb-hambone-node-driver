const {setInterval} =  require('timers/promises');
const CCKDisplay = require('./modules/CCKDisplay.js');

module.exports = class Demo{
    static FLASH_RATE_MS         = 1000; //On for FLASH_RATE_MS off for FLASH_RATE_MS

    static COLORS = {
        BLACK: [0, 0, 0],
        OFF:   [0, 0, 0],
        RED:   [255, 0, 0],
        GREEN: [0, 255, 0]
    };

    constructor(cckDisplay) {
        this.cck = cckDisplay;
    }

    async allErrorFlashing(timeMs) {
        let on = true,
            self = this;

        timeMs = parseFloat(timeMs) || 0;
        self.cck.setAllSegmentsColor(...Demo.COLORS.RED);
        for await (const startTimeMs of setInterval(Demo.FLASH_RATE_MS, Date.now())) {
            on = !on;

            if ((Date.now() - startTimeMs) >= timeMs) {
                self.cck.allSegmentsOff();
                break;
            }
            if(on) self.cck.setAllSegmentsColor(...Demo.COLORS.RED);
            else self.cck.allSegmentsOff();
        }
    }

    async presenterFlashing(r, g, b, timeMs) {
        return this.segmentFlashing(CCKDisplay.presenterSegmentIndex, timeMs, r, g, b);
    }
    async displayFlashing(r, g, b, timeMs) {
        return this.segmentFlashing(CCKDisplay.displaySegmentIndex, timeMs, r, g, b);
    }
    async scannerFlashing(r, g, b, timeMs) {
        return this.segmentFlashing(CCKDisplay.scannerSegmentIndex, timeMs, r, g, b);
    }

    async checkRetractTimer(timeMs) {
        // Countdown animation
        // Animation goes from all Green to yellow to red. Red represents time out.
        let self = this;
        timeMs = parseFloat(timeMs) || 0;
        for await (const startTimeMs of setInterval(100, Date.now())) {
            let dt = Date.now() - startTimeMs;
            if (dt >= timeMs) {
                //self.allSegmentsOff();
                break;
            }
            let rgb = CCKDisplay.fadeGreenDownToRed(1 - (dt/timeMs));
            self.setAllSegmentsColor(rgb.r, rgb.g, rgb.b);
        }
    }

    async segmentFlashing(segmentIndex, timeMs, r, g, b) {
        let on = true,
            self = this;

        timeMs = parseFloat(timeMs) || 0;
        self.setSegment(segmentIndex, r, g, b);
        for await (const startTimeMs of setInterval(CCKDisplay.FLASH_RATE_MS, Date.now())) {
            on = !on;

            if ((Date.now() - startTimeMs) >= timeMs) {
                self.setSegment(segmentIndex, ...CCKDisplay.COLORS.OFF);
                break;
            }
            if(on) self.setSegment(segmentIndex, r, g, b);
            else self.setSegment(segmentIndex, ...CCKDisplay.COLORS.OFF);
        }
    }
};
