
const isPromise = (val) => (val && typeof val.then === 'function')

const isAction = (action) => (action && typeof action.type === 'string')

const toArray = (item) => (!Array.isArray(item))
  ? [item]
  : item

const emptyFn = () => {}

// type, type, type..., function
export const createPromise = (...params) => {
  const fn = params.pop()
  const types = params
  return _createPromise(types, fn)
}

const _createPromise = (types, fn) => {
  return fn => action => {
    return types.includes(action.type) ? fn(action) : emptyFn()
  }
}

const dispatchIfAction = (action, store) => {
  if(!isAction(result)){
    return null
  }
  store.dispatch(result)
}

const resolvePromise = (store, promise) => {
  return promise.then( (maybeActions) =>
    toArray(maybeActions)
      .filter( maybeAction => isAction(maybeAction))
      .map( action => store.dispatch(action))
}

export function createBirdMiddleware(promiseCreators){
  const birdMiddleware = store => next => action => {
    next(action)
    return toArray(promiseCreators)
      .map( promiseCreator => promiseCreator(action) )
      .filter( maybePromise => isPromise(maybePromise))
      .map( promise => resolvePromise(store, promise) )
  }
  return birdMiddleware
}