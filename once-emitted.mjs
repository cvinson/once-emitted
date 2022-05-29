export async function once (emitter, eventName, { timeout, resolveOn, rejectOn } = {}) {
  return new Promise(function (resolve, reject) {
    let timeoutId;
    if (typeof timeout === 'number') {
      timeoutId = setTimeout(function() {
        reject(new Error(`Once timed out after ${timeout}ms`));
      }, timeout);
    }

    const end = (action) => (args) => {
      clearTimeout(timeoutId);
      return action(args);
    };
    const succeed = end(resolve);
    const fail = end(reject);

    emitter.on(eventName, function(...args) {
      if (!resolveOn && !rejectOn) {
         return succeed(args);
      }

      if (typeof rejectOn === 'function' && rejectOn(...args) === true) {
        return fail(args);
      } else if (typeof resolveOn === 'function' && resolveOn(...args) === true) {
         return succeed(args);
      }
    });
  });
}
