export interface ICommand<T = any> {
  execute(): Promise<T>;
}
