import axios from 'axios'
const db = firebase.firestore();

/**
 * ACTION TYPES
 */
const SET_QUEUE = 'SET_QUEUE'
// const GET_CURRENT = 'GET_CURRENT'


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
// const getCurrent = current => ({type: GET_CURRENT, current})
/**
 * THUNK CREATORS
 */
export const fetchQueue = () =>
  dispatch => {
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

    // case GET_CURRENT:
    //   return Object.assign({}, state, {current: action.current})

    default:
      return state
  }
}
