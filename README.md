

```js
const axios = require('axios')
const { configurStore, applyMiddleware } = require('redux')
const { createPromiseEpicMiddleware, ofType } = require('../')

// actions
const FETCH_USER = "FETCH_USER"
const FETCH_USER_FULFILLED = "FETCH_USER_FULFILLED"
const fetchUser = () => {
  return { type: FETCH_USER }
}
const fetchUserFulfilled = payload => {
  return { type: FETCH_USER_FULFILLED, payload }
}

// epic
const fetchUserPromiseEpic = ofType(FETCH_USER)(action => {
  return axios.get(`/api/users/`)
    .then( ({ data }) => {
      return fetchUserFulfilled(data)
    })
})

const promiseEpicMiddleware = createPromiseEpicMiddleware(fetchUserPromiseEpic);
const store = configurStore( applyMiddleware(promiseEpicMiddleware) );

```