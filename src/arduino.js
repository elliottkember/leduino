import { AVRRunner } from './execute';
import { drawPixels } from './drawPixels';
import { WS2812Controller } from './ws2812';
const MHZ = 16000000;

export default class LEDuino {
  constructor({ rows = 14, cols = 14, canvas, serpentine = true, hex, onPixels, onSerial }) {
    this.rows = rows;
    this.cols = cols;
    this.canvas = canvas;
    this.onPixels = onPixels;
    this.onSerial = onSerial;
    this.serpentine = serpentine;
    this.hex = hex;

    // Used for the precompiled code
    this.dataPin = 12;
  }

  onPixels = () => console.log('Pixels callback was not defined');
  onSerial = () => console.log('Serial callback was not defined');

  cpuNanos = () => Math.round((this.runner.cpu.cycles / MHZ) * 1000000000);

  listener = () => {
    this.matrixController.feedValue(this.runner.portB.pinState(6), this.cpuNanos());
  };

  set hex(newHex) {
    if (newHex === this._hex) return;

    this.runner?.portB.removeListener(this.listener);
    this.runner?.stop();

    this._hex = newHex;
    this.runner = new AVRRunner(this._hex);
    this.matrixController = new WS2812Controller(this.cols * this.rows);

    this.runner.portB.addListener(this.listener);

    this.runner.usart.onByteTransmit = (value) => this.onSerial(String.fromCharCode(value));

    this.start();
  }

  stop = () => {
    this.runner?.stop();
  };

  start = () => {
    this.runner?.execute((_cpu) => {
      const pixels = this.matrixController.update(this.cpuNanos());

      if (!pixels) return;
      const pixelsToDraw = [];

      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          const value = pixels[row * this.cols + col];

          let x = col;
          if (this.serpentine) x = row % 2 ? this.cols - col - 1 : col;

          pixelsToDraw.push({
            x,
            y: row,
            b: value & 0xff,
            r: (value >> 8) & 0xff,
            g: (value >> 16) & 0xff,
          });
        }
      }

      if (this.canvas) {
        drawPixels(pixelsToDraw, this.canvas, this.rows, this.cols, this.serpentine);
      } else {
        this.onPixels(pixelsToDraw);
      }
    });
  };
}

module.exports = {
  LEDuino,
};
