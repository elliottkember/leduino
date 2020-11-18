import { PinState } from 'avr8js';
const ZERO_HIGH = 400; // ±150ns
const ONE_HIGH = 800; // ±150ns
const ZERO_LOW = 850; // ±150ns
const ONE_LOW = 450; // ±150ns
const MARGIN = 160; // 160 gives extra margin for FastLED
const RESET_TIME = 50000;
export class WS2812Controller {
    constructor(numPixels = 0) {
        this.numPixels = numPixels;
        this.pixels = new Uint32Array(this.numPixels);
        this.pixelIndex = 0;
        this.currentValue = 0;
        this.bitIndex = 0;
        this.lastState = PinState.Input;
        this.lastTimestamp = 0;
        this.detectZero = false;
        this.detectOne = false;
        this.overflow = false;
        this.updated = true;
    }
    feedValue(pinState, cpuNanos) {
        if (pinState !== this.lastState) {
            const delta = cpuNanos - this.lastTimestamp;
            if (!this.overflow &&
                (this.lastState === PinState.High || this.lastState === PinState.InputPullUp)) {
                if (delta >= ZERO_HIGH - MARGIN && delta <= ZERO_HIGH + MARGIN) {
                    this.detectZero = true;
                }
                if (delta >= ONE_HIGH - MARGIN && delta <= ONE_HIGH + MARGIN) {
                    this.detectOne = true;
                }
                if (pinState === PinState.Low) {
                    this.checkLastBit();
                }
            }
            if (this.lastState === PinState.Low) {
                if (this.detectZero && delta >= ZERO_LOW - MARGIN) {
                    this.feedBit(0);
                }
                else if (this.detectOne && delta >= ONE_LOW - MARGIN) {
                    this.feedBit(1);
                }
                if (delta >= RESET_TIME) {
                    this.resetState();
                }
                this.detectZero = false;
                this.detectOne = false;
            }
            this.lastState = pinState;
            this.lastTimestamp = cpuNanos;
        }
    }
    checkLastBit() {
        // For the last bit in transmission, we might not detect the LOW period, as the signal
        // may not go back HIGH for a long time. Thus, we update the LED based on the predicted
        // value of the last bit
        if (this.bitIndex === 23) {
            this.pixels[this.pixelIndex] = this.currentValue | (this.detectOne ? 1 : 0);
            this.updated = true;
        }
    }
    feedBit(value) {
        if (value) {
            this.currentValue |= 1 << (23 - this.bitIndex);
        }
        this.bitIndex++;
        if (this.bitIndex === 24) {
            this.pixels[this.pixelIndex++] = this.currentValue;
            this.updated = true;
            this.bitIndex = 0;
            this.currentValue = 0;
        }
        if (this.pixelIndex >= this.numPixels) {
            this.overflow = true;
        }
    }
    resetState() {
        this.detectZero = false;
        this.detectOne = false;
        this.overflow = false;
        this.bitIndex = 0;
        this.currentValue = 0;
        this.pixelIndex = 0;
    }
    update(cpuNanos) {
        let result = null;
        if (this.updated) {
            const delta = cpuNanos - this.lastTimestamp;
            if (!this.overflow &&
                this.bitIndex === 23 &&
                this.detectZero &&
                this.lastState === PinState.Low &&
                delta >= ZERO_LOW - MARGIN) {
                this.pixels[this.pixelIndex] = this.currentValue;
            }
            result = this.pixels;
            this.updated = false;
        }
        return result;
    }
}
