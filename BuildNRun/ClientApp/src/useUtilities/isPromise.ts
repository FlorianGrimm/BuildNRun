export function isPromiseLike(object:any){
    //return object!==undefined && object!=null && Promise.resolve(object) == object;
    return !!object && (typeof object === 'object' || typeof object === 'function') && typeof object.then === 'function';

    // if (Promise && Promise.resolve) {
    // } else {
    //   throw "Promise not supported in your environment"
    // }
  }
  export function isPromise(object:any){
    //return object!==undefined && object!=null && Promise.resolve(object) == object;
    return !!object && (typeof object === 'object' || typeof object === 'function') && typeof object.then === 'function' && typeof object.catch === 'function';

    // if (Promise && Promise.resolve) {
    // } else {
    //   throw "Promise not supported in your environment"
    // }
  }
  