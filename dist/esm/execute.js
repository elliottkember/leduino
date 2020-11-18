var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { usart0Config, AVRUSART, avrInstruction, AVRTimer, CPU, timer0Config, AVRIOPort, portBConfig, } from 'avr8js';
import { loadHex } from './intelhex';
// ATmega328p params
const FLASH = 0x40000;
export class AVRRunner {
    constructor(hex) {
        this.program = new Uint16Array(FLASH);
        this.speed = 16e6; // 16 MHZ
        this.stopped = false;
        loadHex(hex, new Uint8Array(this.program.buffer));
        this.cpu = new CPU(this.program, 0x2200);
        this.timer = new AVRTimer(this.cpu, Object.assign(Object.assign({}, timer0Config), { compAInterrupt: 0x02a, compBInterrupt: 0x02c, ovfInterrupt: 0x02e }));
        this.portB = new AVRIOPort(this.cpu, portBConfig);
        this.usart = new AVRUSART(this.cpu, usart0Config, this.speed);
    }
    execute(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stopped = false;
            for (;;) {
                avrInstruction(this.cpu);
                this.timer.tick();
                if (this.cpu.cycles % 500000 === 0) {
                    callback(this.cpu);
                    yield new Promise((resolve) => setTimeout(resolve, 0));
                    if (this.stopped) {
                        break;
                    }
                }
            }
        });
    }
    stop() {
        this.stopped = true;
    }
}
