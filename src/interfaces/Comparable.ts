export default interface Comparable<T> {
  compareTo(that: T): number;
}
