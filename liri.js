require("dotenv").config();
var keys = require("./keys.js");

var Spotify = require('node-spotify-api');


var axios = require("axios");

var command = process.argv[2];

var fs = require("fs");


// MAIN LOGIC
if (command === "movie-this") {
    movieThis();
   
} else if (command === "spotify-this-song"){
  spotifyThis(process.argv[3]);

}
  else if (command === "concert-this"){
   concertThis();
} else if (command === "do-what-it-says"){
   doWhatItSays();
};

// FUNCTIONS
function movieThis() {
    var movieName = process.argv[3];
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + keys.omdb.key;

    axios.get(queryUrl).then(
        function (response) {
            console.log("Movie title: " + response.data.Title);
            console.log("Movie Year: " + response.data.Year);
            console.log("Movie IMDB Rating: " + response.data.imdbRating);
            console.log("Movie Rotten Tomato Rating: " + response.data.tomatorrating);
            console.log("Movie Country: " + response.data.Country);
            console.log("Movie language: " + response.data.Language);
            console.log("Movie Plot: " + response.data.Plot);
            console.log("Movie Actors: " + response.data.Actors);

        }
    );
}

function spotifyThis(song) {
  var spotify = new Spotify({
  id: keys.spotify.id,
  secret: keys.spotify.secret
});
 
spotify.search({ type: 'track', query: song, limit: 1}, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);

  }
 
console.log(JSON.stringify('Artist(s): ' + data.tracks.items[0].album.artists[0].name,null,2));
console.log(JSON.stringify('Song Name: ' + data.tracks.items[0].name,null,2));
console.log(JSON.stringify('Album Name: ' + data.tracks.items[0].album.name,null,2)); 
console.log(JSON.stringify('Preview Link: ' + data.tracks.items[0].album.external_urls.spotify,null,2));
});
}


function doWhatItSays() {

fs.readFile("random.txt", "utf8", function(error, data) {

  // If the code experiences any errors it will log the error to the console.
  if (error) {
    return console.log(error);
  }

  // We will then print the contents of data
  console.log(data);

  // Then split it by commas (to make it more readable)
  var dataArr = data.split(",");

  console.log(dataArr);

  // We will then re-display the content as an array for later use.
  if (dataArr[0] === "spotify-this-song"){
      spotifyThis(dataArr[1]);
  } if (dataArr[2] === "movie-this"){
      movieThis(dataArr[3]);
  } else if (dataArr[0] === "concert-this"){
      
  }
});
};

function concertThis(artistName) {

        var URL = `https://rest.bandsintown.com/artist/${artistName}/events?app_id=codingbootcamp`;

        axios.get(URL).then((response) => {
             
            const jsonData = response.data;

            const showConcertData = [
                "Venue Name: " + jsonData[0].venue.name,
                "Venue Location: " + jsonData[0].venue.city + " , " + jsonData[0].venue.region,
                "Date and Time: " + moment(jsonData.datetime).format("LLL")
            ].join("\n\n");

            return showConcertData;
        }).then(data => {
            return storeAndDisplayData(data);
        }).catch(err => {
            console.log(err);
        });
    }