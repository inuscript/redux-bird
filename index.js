
const isPromise = (val) => (val && typeof val.then === 'function')

const isAction = (action) => (action && typeof action.type === 'string')

const toArray = (item) => (!Array.isArray(item))
  ? [item]
  : item

export const ofType = (...types) => {
  return fn => action => {
    return types.includes(action.type) ? fn(action) : null
  }
}

const dispatchIfAction = (action, store) => {
  if(!isAction(result)){
    return null
  }
  store.dispatch(result)
}

export function createBirdMiddleware(birds){
  const birdMiddleware = store => next => action => {
    next(action)
    return toArray(birds)
      .map( bird => bird(action) )
      .filter( maybePromise => isPromise(maybePromise))
      .map( promise => promise
        .then( (maybeActions) =>
          toArray(maybeActions)
            .filter(maybeAction => isAction(maybeAction))
            .map( (action) => store.dispatch(action))
          )
        )
  }
  return birdMiddleware
}