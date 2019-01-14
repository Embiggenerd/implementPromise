/**
 *
 *
 *
 *    returnVal.then(handler 2) --> promise 2
 * if returnVal1 is promise, call returnVal1.then
 * return empty promise 2
 * resolve(handler1(value)) ->returnVal 1
 * then(handler1)
 * promise 1
 */

// There are three promises. The second promise, passed as handler to the first then
// is invoked, but the res value is passsed to the third promise, which is the second
// resolver.promise.
// The second then passed a second handler to a third promise. That third promise has
// the second handler, and its _resolve method is passed the returned value of the first
// handler(value) as value
class MyPromise {
  constructor(executor) {
    this.state = "pending"
    this._value = undefined
    this._rejectReason = undefined
    this.resolutionQueue = [];
    this.rejectionQueue = []
    executor(this._resolve.bind(this));
  }

  _invokeResolvers(){
    while (this.resolutionQueue.length > 0) {
      const resolver = this.resolutionQueue.shift();
      const returnedVal = resolver.handler(this._value);
      if (returnedVal && returnedVal instanceof MyPromise) {
        returnedVal.then(function(v) {
          resolver.promise._resolve(v);
        });
      } else {
        resolver.promise._resolve(returnedVal)
      }
    }
  }

  _invokeRejectors(){
    while (this.rejectionQueue.length > 0) {
      const rejector = this.rejectionQueue.shift();
      const returnedVal = rejector.handler(this._rejectionReason);
      if (returnedVal && returnedVal instanceof MyPromise) {
        returnedVal.then(function(v) {
          rejector.promise._resolve(v);
        });
      } else {
        rejector.promise._resolve(returnedVal)
      }
    }
  }

  _resolve(value) {
    if(this.state === "pending"){
      this._value = value
      this.invokeResolvers()
      this.state = "resolved"
    }
  }

  _reject(reason){
    if(this.state === "pending"){
      this._rejectReason = reason
      this._invokeRejectors()
      this.state = "rejected"
    }
  }

  then(handler) {
    const newPromise = new MyPromise(function() {});
    this.resolutionQueue.push({
      handler: handler,
      promise: newPromise
    });

    if (this.state === "resolved"){
      this._invokeResolvers()
    }
    return newPromise;
  }

  catch(handler){
    const newPromise = new MyPromise(function() {});
    this.rejectionQueue.push({
      handler: handler,
      promise: newPromise
    });

    if (this.state === "rejected"){
      this._invokeRejectors()
    }
    return newPromise;
  }


}

module.exports = MyPromise;
