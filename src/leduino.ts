import { AVRRunner } from './execute';
import { drawLayoutPixels } from './drawPixels';
import { WS2812Controller } from './ws2812';
import Pixel from './pixel';
const MHZ = 16000000;

class LEDuino {
  rows: number;
  cols: number;
  canvas?: HTMLCanvasElement;
  serpentine: boolean;
  matrixController: WS2812Controller;
  runner: AVRRunner;
  _hex: string;
  coordinates?: [number, number][];

  constructor({
    rows = 14,
    cols = 14,
    canvas = undefined,
    serpentine = true,
    hex = '',
    onPixels = undefined,
    onSerial = undefined,
    coordinates = undefined,
  }) {
    this.rows = rows;
    this.cols = cols;
    this.canvas = canvas;
    this.onPixels = onPixels;
    this.onSerial = onSerial;
    this.serpentine = serpentine;
    this.hex = hex;
    this.coordinates = coordinates;
  }

  onPixels?: (pixels: Array<Pixel>) => void;
  onSerial?: (output: string) => void;

  cpuNanos = () => Math.round((this.runner.cpu.cycles / MHZ) * 1000000000);

  listener = () => {
    this.matrixController.feedValue(this.runner.portB.pinState(6), this.cpuNanos());
  };

  set hex(newHex: string) {
    if (newHex === this._hex) return;

    this.runner?.portB.removeListener(this.listener);
    this.runner?.stop();

    this._hex = newHex;
    this.runner = new AVRRunner(this._hex);
    this.matrixController = new WS2812Controller(this.cols * this.rows);

    this.runner.portB.addListener(this.listener);

    this.runner.usart.onByteTransmit = (value) => {
      this.onSerial && this.onSerial(String.fromCharCode(value));
    };

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

      for (let i = 0; i < pixels.length; i++) {
        const value = pixels[i];

        let x, y;
        if (this.coordinates) {
          const coordinates = this.coordinates[i];
          [x, y] = coordinates;
        } else {
          const col = i % this.cols;
          const row = Math.floor(i / this.cols); // - col;
          x = col;
          if (this.serpentine) x = row % 2 ? this.cols - col - 1 : col;
          y = row;
        }

        pixelsToDraw.push({
          x,
          y,
          b: value & 0xff,
          r: (value >> 8) & 0xff,
          g: (value >> 16) & 0xff,
        });
      }

      if (this.canvas) {
        if (this.coordinates) {
          drawLayoutPixels(
            pixelsToDraw,
            this.canvas,
            this.rows,
            this.cols,
            this.serpentine,
            this.coordinates
          );
        } else {
          drawLayoutPixels(
            pixelsToDraw,
            this.canvas,
            this.rows,
            this.cols,
            this.serpentine,
            this.coordinates
          );
        }
      }

      if (this.onPixels) {
        this.onPixels(pixelsToDraw);
      }
    });
  };
}

export default LEDuino;
