const expect = require("expect")
const axios = require("axios")
const { createPromiseEpicMiddleware, filterType } = require('../')

const payload = { id: 123 };

const mockAdapter = (config) => {
  return new Promise((resolve, reject) => {
    resolve({data: payload, status: 200 })
  })
}

const fakeApi = axios.create({
  adapter: mockAdapter
})

const FETCH_USER = "FETCH_USER"
const FETCH_USER_FULFILLED = "FETCH_USER_FULFILLED"

const fetchUserFulfilled = payload => {
  return { type: FETCH_USER_FULFILLED, payload }
}

const fetchUserPromiseEpic = filterType(FETCH_USER)(action => {
  return fakeApi.get(`/api/users/${action.payload}`)
    .then( ({ data }) => {
      return fetchUserFulfilled(data)
    })
})

const configureMockStore = require('redux-mock-store').default
const promiseEpicMiddleware = createPromiseEpicMiddleware([fetchUserPromiseEpic]);
const mockStore = configureMockStore([promiseEpicMiddleware]);

describe('fetchUserEpic', () => {
  it('produces the user model', (done) => {
    const store = mockStore();
    const actions = store.dispatch({ type: FETCH_USER })
    Promise.all(actions)
      .then( x => {
        expect(store.getActions()).toEqual([
          { type: FETCH_USER },
          { type: FETCH_USER_FULFILLED, payload }
        ])
        done()
      })
  })
})