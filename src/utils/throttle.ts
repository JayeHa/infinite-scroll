export const throttle = (handler: (...args: any[]) => void, timeout = 300) => {
  let invokedTime: number;
  let timer: number;
  return function (this: any, ...args: any[]) {
    if (!invokedTime) {
      handler.apply(this, args);
      invokedTime = Date.now();
    }

    if (invokedTime) {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (Date.now() - invokedTime >= timeout) {
          handler.apply(this, args);
          invokedTime = Date.now();
        }
      }, Math.max(timeout - (Date.now() - invokedTime), 0));
    }
  };
};

export const throttleByAnimationFrame = (handler: (...args: any[]) => void) => {
  return function (this: any, ...args: any[]) {
    window.requestAnimationFrame(() => {
      handler.apply(this, args);
    });
  };
};