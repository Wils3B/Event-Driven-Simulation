import MinPQ from './models/MinPQ.js';
import Event from './models/Event.js';
import Particle from './models/Particle.js';
import Drawer from './models/Drawer.js';

export default class CollisionSystem {
  private pq: MinPQ<Event> = new MinPQ<Event>();
  private t: number = 0;

  constructor(
    private readonly particles: Particle[],
    private readonly drawer: Drawer
  ) {}

  private predict(a?: Particle, limit: number = 120000) {
    if (a == null) return;
    this.particles.forEach((b) => {
      const dt = a.timeToHit(b);
      if (dt > 0 && dt + this.t <= limit) {
        this.pq.insert(new Event(dt + this.t, a, b));
      }
    });
    const { areaHeight, areaWidth } = this.drawer;
    const dtx = a.timeToHitHorizontalWall(areaHeight);
    if (dtx > 0 && dtx + this.t <= limit)
      this.pq.insert(new Event(dtx + this.t, undefined, a));
    const dty = a.timeToHitVerticalWall(areaWidth);
    if (dty > 0 && dty + this.t <= limit)
      this.pq.insert(new Event(dty + this.t, a, undefined));
  }

  simulate(maxCollisions: number = 10000) {
    this.particles.forEach((p) => this.predict(p));
    this.pq.insert(new Event(0));
    const counterElement = document.getElementById('count');

    let collisionCount = 0;
    const next = async () => {
      if (this.pq.isEmpty()) return;
      const event = this.pq.delMin();
      console.log('Event valid ?', event.isValid());
      if (!event.isValid()) {
        next();
        return;
      }
      const { a, b } = event;

      const dt = event.time - this.t;
      this.particles.forEach((p) => p.move(dt));
      await this.sleep(dt);
      this.t = event.time;

      if (a == null && b == null) this.redraw();
      else if (a == null && b != null) b.bounceHorizontalWall();
      else if (a != null && b == null) a.bounceOffVerticalWall();
      else if (a != null && b != null) a.bounceOff(b);

      this.predict(a);
      this.predict(b);
      console.log(
        'Next',
        event.type(),
        dt,
        this.particles.filter((p) => p.cx > this.drawer.areaWidth || p.cx < 0 || p.cy < 0 || p.cy > this.drawer.areaHeight),

      );
      counterElement.textContent = `${collisionCount + 1}/${maxCollisions}`
      if (++collisionCount < maxCollisions) next();
    };
    next();
  }

  redraw() {
    console.log('redraw');
    const { drawer } = this;
    drawer.clear();
    this.particles.forEach((p) => {
      drawer.drawParticle(p);
    });
    this.pq.insert(new Event(this.t + 50));
  }

  private sleep(time: number): Promise<undefined> {
    return new Promise<undefined>((resolve) => setTimeout(resolve, time));
  }
}
