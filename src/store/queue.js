import axios from 'axios'
const db = firebase.firestore();

/**
 * ACTION TYPES
 */
const SET_QUEUE = 'SET_QUEUE'
// const ADD_QUEUE = 'ADD_QUEUE'


/**
 * INITIAL STATE
 */
const initialState = {
  queue: []
};

/**
 * ACTION CREATORS
 */
const getQueue = queue => ({type: GET_QUEUE, queue})

/**
 * THUNK CREATORS
 */
export const fetchQueue = () =>
  dispatch => {
    //Replace with firestore
    axios.get('/api/queue')
      .then(res => {
        console.log("queue thunk!!!", res.data);
        dispatch(getQueue(res.data))
      })
      .catch(err => console.log(err))
  }

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case SET_QUEUE:
      return Object.assign({}, state, {queue: action.queue})

    default:
      return state
  }
}
