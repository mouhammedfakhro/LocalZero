export interface AsyncHandler {
    setNext(handler: AsyncHandler): AsyncHandler;
    handle(data: any): Promise<string | null>;
  }
  
  export abstract class AbstractAsyncHandler implements AsyncHandler {
    private nextHandler: AsyncHandler | null = null;
  
    public setNext(handler: AsyncHandler): AsyncHandler {
      this.nextHandler = handler;
      return handler;
    }
  
    public async handle(data: any): Promise<string | null> {
      if (this.nextHandler) {
        return this.nextHandler.handle(data);
      }
      return null;
    }
  }
  