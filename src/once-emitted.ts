import { EventEmitter } from 'events';

export interface OnceOptions {
  timeout?: number,
  resolveOn?: Function,
  rejectOn?: Function
}

export async function once<
 Emitter extends EventEmitter 
>(
  emitter: Emitter,
  eventName: string,
  options?: OnceOptions
): Promise<any> {
  return new Promise(function (resolve, reject) {
    let timeoutId: NodeJS.Timeout;
    if (typeof options?.timeout === 'number') {
      timeoutId = setTimeout(function() {
        reject(new Error(`Once timed out after ${options.timeout}ms`));
      }, options.timeout);
    }

    const end = (action: Function) => (args: any) => {
      clearTimeout(timeoutId);
      return action(args);
    };
    const succeed = end(resolve);
    const fail = end(reject);

    emitter.on(eventName, function(...args) {
      if (!options?.resolveOn && !options?.rejectOn) {
         return succeed(args);
      }

      if (typeof options.rejectOn === 'function' && options.rejectOn(...args) === true) {
        return fail(args);
      } else if (typeof options.resolveOn === 'function' && options.resolveOn(...args) === true) {
         return succeed(args);
      }
    });
  });
}
