const expect = require("expect")
const axios = require("axios")
const { createBirdMiddleware, ofType } = require('../')

const payloadMock = { id: 123 }
// api-utils
const mockAdapter = (config) => {
  return new Promise((resolve, reject) => {
    resolve({data: payloadMock, status: 200 })
  })
}

const fakeApi = axios.create({
  adapter: mockAdapter
})

// action
const FETCH_USER = "FETCH_USER"
const FETCH_USER_FULFILLED = "FETCH_USER_FULFILLED"

const fetchUser = () => {
  return { type: FETCH_USER }
}
const fetchUserFulfilled = payload => {
  return { type: FETCH_USER_FULFILLED, payload }
}

// Promise
const fetchUserBird = ofType(FETCH_USER)(action =>
  fakeApi
    .get(`/api/users/${action.payload}`)
    .then( ({ data }) => {
      return fetchUserFulfilled(data)
    })
  )

/////////
const configureMockStore = require('redux-mock-store').default
const birdMiddleware = createBirdMiddleware([fetchUserBird]);
const mockStore = configureMockStore([birdMiddleware]);

describe('fetchUserEpic', () => {
  it('produces the user model', (done) => {
    const store = mockStore();
    const actions = store.dispatch(fetchUser(10))
    Promise.all(actions)
      .then( x => {
        expect(store.getActions()).toEqual([
          { type: FETCH_USER },
          { type: FETCH_USER_FULFILLED, payload: payloadMock }
        ])
        done()
      }).catch( e => {
        console.log(e)
      })
  })
})