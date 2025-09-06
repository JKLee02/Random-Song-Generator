// Unload the loader animation when in the page
window.addEventListener("load", () => {
  const loader = document.querySelector('.loader');
  loader.classList.add('loader-hidden');
});

// Getting random songs by fetching the data from the backend.js
async function getSongs() {

  // Load the loader only when it is triggered by the generate button
  const loader = document.querySelector('.loader');
  loader.classList.remove('loader-hidden');

  let countSong = Number(document.getElementById('song-number-input').value.trim());

  // If the no. of inputted songs are less than 1, it will be defaulted to 1 song, similar for over 6 songs as well
  if (countSong < 1) {
    countSong = 1;
  }
  else if (countSong > 6){
    countSong = 6;
  }

  // const apiUrl = import.meta.env.API_URL;

  // const res = await fetch(`${apiUrl}/random-songs?count=${countSong}`);
  const res = await fetch(`http://localhost:3000/random-songs?count=${countSong}`);
  
  const tracks = await res.json();

  if (!Array.isArray(tracks) || tracks.length === 0) {
    console.error("Expected an array but got:", tracks);
    loader.classList.add('loader-hidden'); // Hide the loader if it failed
    return;
  }
  
  // Getting the song grid item DOM
  const songGrid = document.querySelector('.js-song-grid-items');

  // HTML DOM placeholders
  let songsHTML = '';
  tracks.forEach((_, index) => {
    songsHTML += `<div class="embed-song" id="embed-${index}"></div>`;
  })

  // Replace all embeds from DOM
  songGrid.innerHTML = songsHTML;

  // Adjust grid style depending on number of tracks
  if (tracks.length === 1)  {
    songGrid.classList.add("center-songs");
  } 
  else if (tracks.length === 2){
    songGrid.classList.add("center-songs");
  }
  else {
    songGrid.classList.remove("center-songs");
  }

  // Embed Iframe API
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      let loadedCount = 0; // It tracks how many embeds are loaded
      
    // For each track, it will create an embed with their respective URI 
    tracks.forEach((track, index) => {
      const embedDiv = document.getElementById(`embed-${index}`);
      IFrameAPI.createController(embedDiv, { uri: track.uri }, (controller) => {
        console.log(`Loaded: ${track.name} by ${track.artists.map(a => a.name).join(", ")}`);

        loadedCount++;
        // Hide the loader only when all tracks are loaded
        if(loadedCount === tracks.length) {
          loader.classList.add('loader-hidden');
        }

      });
    });
  };


}

// AddEventListener when clicking on the generate button, it will get the random song
document.querySelector('.js-generate-button').addEventListener('click', () => { 
  getSongs();
});

// AddEventListener for generating songs by using "Enter" key
const inputSong = document.getElementById('song-number-input');

inputSong.addEventListener('keypress', (event) => {
  if (event.key === 'Enter'){
    event.preventDefault(); // To prevent any default form action (just in case)
    document.querySelector('.js-generate-button').click();
  }
})