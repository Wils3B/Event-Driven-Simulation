export default class Particle {
  count: number = 1;

  constructor(
    public cx: number,
    public cy: number,
    public vx: number,
    public vy: number,
    public radius: number = 5,
    public mass: number = 2,
    public color: string = 'black',
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  move(dt: number) {
    this.cx += this.vx * dt;
    this.cy += this.vy * dt;
  }

  timeToHit(that: Particle): number {
    if (this == that) return Number.POSITIVE_INFINITY;
    const dx  = that.cx - this.cx;
    const dy  = that.cy - this.cy;
    const dvx = that.vx - this.vx;
    const dvy = that.vy - this.vy;
    const dvdr = dx*dvx + dy*dvy;
    if (dvdr > 0) return Number.POSITIVE_INFINITY;
    const dvdv = dvx*dvx + dvy*dvy;
    if (dvdv == 0) return Number.POSITIVE_INFINITY;
    const drdr = dx*dx + dy*dy;
    const sigma = this.radius + that.radius;
    const d = (dvdr*dvdr) - dvdv * (drdr - sigma*sigma);
    if (d < 0) return Number.POSITIVE_INFINITY;
    return -(dvdr + Math.sqrt(d)) / dvdv;
  }

  timeToHitHorizontalWall(areaHeight: number): number {
    if (this.vy > 0) return (areaHeight - this.radius - this.cy) / this.vy;
    else if (this.vy < 0) return (this.radius - this.cy) / this.vy;
    return Number.MAX_VALUE;
  }

  timeToHitVerticalWall(areaWidth: number): number {
    if (this.vx > 0) return (areaWidth - this.radius - this.cx) / this.vx;
    else if (this.vx < 0) return (this.radius - this.cx) / this.vx;
    return Number.MAX_VALUE;
  }

  bounceOff(that: Particle) {
    const dx = that.cx - this.cx;
    const dy = that.cy - this.cy;
    const dvx = that.vx - this.vx;
    const dvy = that.vy - this.vy;
    const dvdr = dx * dvx + dy * dvy;
    const distance = this.radius + that.radius;
    const J =
      (2 * this.mass * that.mass * dvdr) / ((this.mass + that.mass) * distance);
    const Jx = (J * dx) / distance;
    const Jy = (J * dy) / distance;
    this.vx += Jx / this.mass;
    this.vy += Jy / this.mass;
    that.vx -= Jx / that.mass;
    that.vy -= Jy / that.mass;
    this.count += 1;
    that.count += 1;
  }

  bounceOffVerticalWall() {
    this.vx = -this.vx;
    this.count += 1;
  }

  bounceHorizontalWall() {
    this.vy = -this.vy;
    this.count += 1;
  }
}
