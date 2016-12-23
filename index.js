
function isPromise(val) {
  return val && typeof val.then === 'function';
}

export const filterType = (...types) => {
  return fn => action => {
    return types.includes(action.type) ? fn(action) : null
  }
}

export function createPromiseEpicMiddleware(promiseEpics){
  if(!Array.isArray(promiseEpics)){
    promiseEpics = [promiseEpics]
  }
  const promiseEpicMiddleware = store => next => action => {
    next(action)
    return promiseEpics.map( promiseEpic => promiseEpic(action) )
      .filter( maybePromise => isPromise(maybePromise))
      .map( promise => {
        return promise.then( (result) => {
          store.dispatch(result)
        })
      })
  }
  return promiseEpicMiddleware
}