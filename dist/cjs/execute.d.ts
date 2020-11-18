import { AVRUSART, AVRTimer, CPU, AVRIOPort } from 'avr8js';
export declare class AVRRunner {
    readonly program: Uint16Array;
    readonly cpu: CPU;
    readonly timer: AVRTimer;
    readonly portB: AVRIOPort;
    readonly usart: AVRUSART;
    readonly speed = 16000000;
    private stopped;
    constructor(hex: string);
    execute(callback: (cpu: CPU) => void): Promise<void>;
    stop(): void;
}
