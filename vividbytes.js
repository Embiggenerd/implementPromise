class MyPromise {
  constructor(executor) {
    this.resolutionQueue = [];
    executor(this._resolve.bind(this));
  }

  _resolve(value) {
    while (this.resolutionQueue.length > 0) {
      let resolution = this.resolutionQueue.shift();
      let returnVal = resolution.handler(value);

      if (returnVal instanceof MyPromise) {
        returnVal.then(function(v) {
          resolution.promise._resolve(v);
        });
      } else {
        resolution.promise._resolve(returnVal)
      }
    }
  }

  then(handler) {
    let newPromise = new MyPromise(function() {});

    this.resolutionQueue.push({
      handler: handler,
      promise: newPromise
    });
    return newPromise;
  }
}

module.exports = MyPromise;
