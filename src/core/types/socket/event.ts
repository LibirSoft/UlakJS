export interface UlakEvent {
  event: string;
  listener: (...args: any[]) => void | Promise<void>;
}
