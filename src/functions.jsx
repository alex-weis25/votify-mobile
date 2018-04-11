import axios from "axios";
import queryString from "query-string";


const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function asyncFetch() {
    console.log("fetching new song");
    await delay(10000);
    getCurrent();
}

asyncFetch();


const getCurrent = () => {
  let parsed = queryString.parse(window.location.search);
  let accessToken = parsed.access_token;

    axios({
      method: "GET",
      url: "https://api.spotify.com/v1/me/player/currently-playing",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    }).then(current => {
      console.log('current in async: ', current)
    })
}
