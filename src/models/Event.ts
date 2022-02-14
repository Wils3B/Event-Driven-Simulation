import Comparable from '../interfaces/Comparable.js';
import Particle from './Particle';

export default class Event implements Comparable<Event> {
  private readonly countA: number;
  private readonly countB: number;

  constructor(public time: number, public a?: Particle, public b?: Particle) {
    this.countA = a?.count || -1;
    this.countB = b?.count || -1;
  }

  compareTo(that: Event): number {
    return this.time - that.time;
  }

  isValid(): boolean {
    if (this.a != null && this.a.count !== this.countA) return false;
    return !(this.b != null && this.b.count !== this.countB);
  }

  type(): string {
    if (this.a != null && this.b != null) return 'Collision';
    if (this.a != null && this.b == null) return 'Horizontal wall';
    if (this.b != null && this.a == null) return 'vertical wall';
    return 'other'
  }
}
