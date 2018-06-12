import axios from "axios";
import queryString from "query-string";
// import { setTop } from "../store/votify";
const db = firebase.firestore();

// Look up password
export async function checkPassword(playlistId) {
  let password;
  console.log('id on functions', playlistId)
  await db
    .collection('Playlists')
    .doc(`${playlistId}`)
    .get()
    .then(playlist => {
      password = playlist.data().password;
    })
    console.log('password on functions', password)
  return password
}

export const setPassword = (playlistId, password) => {
  db
    .collection('Playlists')
    .doc(`${playlistId}`)
    .update({
      password: password
    })
}

//helperFunc
export const sortByVote = array => {
  const updatedOrder = [];
  array.forEach(entry => {
    for (var i = 0; i < array.length; i++) {
      if (!updatedOrder[i] || entry.score >= updatedOrder[i].score) {
        updatedOrder.splice(i, 0, entry);
        break;
      }
    }
  });
  return updatedOrder;
};
