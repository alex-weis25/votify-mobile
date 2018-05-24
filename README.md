Votify ReadMe

Votify is a Progressive Web App that enables group playlist collaboration through the Spotify Web API.

Votify was inspired by the need to find a more effective way to play music at social events.  After many failed attempts at making a pre-populated playlist or experiencing the chaos from offering the aux cord to anyone and everyone, Votify was born. Votify allows users with a Spotify account to connect to an administrator's (the user who created the playlist) Spotify playlist and contribute songs to a queue. The queue is live-updated and viewable by all other users connected to that playlist, but the songs are not yet included in the Spotify playlist (i.e. the songs will only be added once they have been voted to the top of the queue). If another user would also like to hear a song that has already been added to the queue, they can up-vote (or down-vote if they don't want to listen to the track) the track to move it higher in the queue list. While the playlist is 'live' and after the last track has started to play, Votify will add the highest voted song in the queue to the end of the playlist. This will continue until the queue no longer contains tracks. Users can add an infinite (theoretically) number of tracks to the queue, but cannot add the exact same track (according to Spotify's unique track ID) twice to the same queue. Users are only allowed to vote once per track (including their own tracks) and cannot change their vote after it had been submitted.

Usage:
To get started, access Votify at https://votify-b9360.firebaseapp.com and login through the Spotify authentication redirect.

Existing playlist: If you would like to view a playlist that you have already created (the playlist must have been set to 'collaborative: true' and 'public: false' in the playlist settings on Spotify) select "Existing Playlist" and choose the playlist you would like to use with Votify. To share the playlist with a friend, they will need your Spotify Account ID (located in the upper right of the Votify screen) and the name of the playlist you selected.

Note that all new Votify playlists will be added to your Spotify Account's playlists section

New playlist: From the 'Home Screen,' select "New Playlist" and enter the name and short description of the playlist. After submitting, you will be redirected to the Votify playlist (which will be empty by default). To get started, click on the search option and start adding songs to the queue. The first song added will be automatically set as the first song in the playlist. Once the user starts playback of the new playlist on their local Spotify account, the Votify algorithm will initiate and start contributing the highest voted queue item once the last song in the new playlist begins.

Limitations: Votify does not currently allow users to adjust (start, pause, stop, skip, back) playback or delete songs or playlists. All direct manipulation of the live audio and playlists must be accomplished through the Spotify application.

