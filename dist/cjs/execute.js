"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVRRunner = void 0;
const avr8js_1 = require("avr8js");
const intelhex_1 = require("./intelhex");
// ATmega328p params
const FLASH = 0x40000;
class AVRRunner {
    constructor(hex) {
        this.program = new Uint16Array(FLASH);
        this.speed = 16e6; // 16 MHZ
        this.stopped = false;
        intelhex_1.loadHex(hex, new Uint8Array(this.program.buffer));
        this.cpu = new avr8js_1.CPU(this.program, 0x2200);
        this.timer = new avr8js_1.AVRTimer(this.cpu, Object.assign(Object.assign({}, avr8js_1.timer0Config), { compAInterrupt: 0x02a, compBInterrupt: 0x02c, ovfInterrupt: 0x02e }));
        this.portB = new avr8js_1.AVRIOPort(this.cpu, avr8js_1.portBConfig);
        this.usart = new avr8js_1.AVRUSART(this.cpu, avr8js_1.usart0Config, this.speed);
    }
    execute(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stopped = false;
            for (;;) {
                avr8js_1.avrInstruction(this.cpu);
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
exports.AVRRunner = AVRRunner;
