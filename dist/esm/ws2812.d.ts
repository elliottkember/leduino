import { PinState } from 'avr8js';
export declare class WS2812Controller {
    private numPixels;
    readonly pixels: Uint32Array;
    private pixelIndex;
    private currentValue;
    private bitIndex;
    private lastState;
    private lastTimestamp;
    private detectZero;
    private detectOne;
    private overflow;
    private updated;
    constructor(numPixels?: number);
    feedValue(pinState: PinState, cpuNanos: number): void;
    private checkLastBit;
    private feedBit;
    private resetState;
    update(cpuNanos: number): Uint32Array | null;
}
