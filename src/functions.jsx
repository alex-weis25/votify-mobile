import axios from "axios";
import queryString from "query-string";
// import { setTop } from "../store/votify";


//Set top song on state




//Send to Firestore
// export const moveFromQueue = (song) => {
//   const setTop = this.props.setTop
//   const songId = song.songId
//   axios({
//           method: "POST",
//           url: `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks?uris=spotify%3Atrack%3A${songUrl}`,
//           headers: {
//             "Content-Type": "application/json",
//             Authorization:
//             `Bearer ${accessToken}`
//           }
//         })
//           .then(results => {
//             console.log("setting top song", results.data);

//           })
//   }
// }


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
