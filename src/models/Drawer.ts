import Particle from './Particle.js';

export default class Drawer {
  public ctx: CanvasRenderingContext2D;

  constructor(public areaWidth: number, public areaHeight: number) {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.setAttribute('width', String(areaWidth));
    canvas.setAttribute('height', String(areaHeight));
    document.body.appendChild(canvas);
    this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
  }

  clear() {
    this.ctx.clearRect(0, 0, this.areaWidth, this.areaHeight);
  }

  drawParticle(particle: Particle) {
    particle.draw(this.ctx);
  }
}
