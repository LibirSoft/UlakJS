export interface HermesEvent{
    event: string;
    listener: (...args: any[]) => void | Promise<void>;
}