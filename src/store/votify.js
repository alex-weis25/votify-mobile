import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_VOTIFY = 'GET_VOTIFY'
const GET_CURRENT = 'GET_CURRENT'
const SET_TOP = 'SET_TOP'
const SET_OWNER = 'SET_OWNER'


/**
 * INITIAL STATE
 */
const initialState = {
  votify: [],
  current: [],
  topSong: {},
  owner: {}
};

/**
 * ACTION CREATORS
 */
export const getVotify = votify => ({type: GET_VOTIFY, votify})
export const setTop = top => ({type: SET_TOP, top})
export const getCurrent = current => ({type: GET_CURRENT, current})
export const setOwner = owner => ({type: SET_OWNER, owner})

/**
 * THUNK CREATORS
 */
export const fetchVotify = (userId, playlistId, accessToken) =>
  dispatch => {
    console.log('fetch votify thunk: ')
    axios({
      method: "GET",
      url: `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization:
          `Bearer ${accessToken}`
      }
    })
      .then(res => {
        console.log('res in thunk', res.data)
        dispatch(getVotify(res.data))
      })
      .catch(err => console.log(err))
  }

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_VOTIFY:
      return Object.assign({}, state, {votify: action.votify})

    case GET_CURRENT:
      return Object.assign({}, state, {current: action.current})

    case SET_TOP:
      return Object.assign({}, state, {topSong: action.top})

    case SET_OWNER:
      return Object.assign({}, state, {owner: action.owner})

    default:
      return state
  }
}
