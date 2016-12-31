# redux-bird

> Promise based redux middleware

## Example

```js
const axios = require('axios')
const { configurStore, applyMiddleware } = require('redux')
const { createBirdMiddleware, ofType } = require('../')

// actions
const FETCH_USER = "FETCH_USER"
const FETCH_USER_FULFILLED = "FETCH_USER_FULFILLED"
const fetchUser = () => {
  return { type: FETCH_USER }
}

const fetchUserFulfilled = payload => {
  return { type: FETCH_USER_FULFILLED, payload }
}

// promise
const fetchUserPromise = ofType(FETCH_USER)
  .then(action => axios.get(`/api/users/`) )
  .then( ({ data }) => fetchUserFulfilled(data) )

const birdMiddleware = createBirdMiddleware(fetchUserPromise);
const store = configurStore( applyMiddleware(birdMiddleware) );

```

## API

### `createBirdMiddleware( promises: [Promise] )`
Generate promise