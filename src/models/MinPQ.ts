export default class MinPQ<T> {
  private readonly items: T[];

  constructor(
    private comparator?: (a: T, b: T) => number
  ) {
    this.items = [];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  min(): T {
    return this.items[0];
  }

  insert(item: T) {
    this.items[this.size()] = item;
    this.swim(this.size() - 1);
  }

  delMin(): T {
    if (this.isEmpty()) throw new Error('Priority queue underflow');
    const min = this.items[0];
    this.items[0] = this.items[this.size() - 1]
    this.items.pop()
    this.sink(0);
    return min;
  }

  // Swim & Sink
  private swim(k: number) {
    while (k > 0 && this.greater(MinPQ.parentIndex(k), k)) {
      const parent = MinPQ.parentIndex(k);
      this.exchange(parent, k);
      k = parent;
    }
  }

  private sink(k: number) {
    const size = this.size();
    while (MinPQ.leftChildIndex(k) < size) {
      let j = MinPQ.leftChildIndex(k);
      if (j + 1 < size && this.greater(j, j + 1)) {
        j += 1;
      }
      if (!this.greater(k, j)) break;
      this.exchange(k, j);
      k = j;
    }
  }

  // Helpers functions
  private greater(i: number, j: number): boolean {
    if (this.comparator) {
      return this.comparator(this.items[i], this.items[j]) > 0;
    }
    if ('function' === typeof (<any>this.items[i]).compareTo) {
      return (<any>this.items[i]).compareTo(this.items[j]) > 0;
    }
    return false;
  }

  private static leftChildIndex(index: number) {
    return 2 * index + 1;
  }

  private static rightChildIndex(index: number) {
    return 2 * index + 2;
  }

  private static parentIndex(index: number) {
    return Math.floor((index - 1) / 2);
  }

  private exchange(i: number, j: number) {
    const swap = this.items[i];
    this.items[i] = this.items[j];
    this.items[j] = swap;
  }

  // Assertion methods
  isMinHeap() {
    return this.isMinHeapOrdered(0);
  }

  private isMinHeapOrdered(k: number): boolean {
    const size = this.size()
    if (k >= size) return true;
    const left = MinPQ.leftChildIndex(k);
    const right = left + 1;
    if (left < size && this.greater(k, left)) return false;
    if (right < size && this.greater(k, right)) return false;
    return this.isMinHeapOrdered(left) && this.isMinHeapOrdered(right);
  }
}
