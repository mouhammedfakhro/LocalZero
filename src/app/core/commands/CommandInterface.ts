export interface Command<T = any> {
  execute(): Promise<T>;
}