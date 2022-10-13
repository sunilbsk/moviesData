const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//API GET METHOD - All movies List//

app.get("/movies/", async (request, response) => {
  const getMovieQuery = `
    SELECT 
     *
    FROM
      movie;`;
  const dbResponse = await db.all(getMovieQuery);
  response.send(dbResponse);
});

// API POST METHOD - add movie //

app.get("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovie = `
     INSERT INTO 
     movie(director_id,movie_name,lead_actor)
     Values (
         "${directorId}",
         "${movieName}",
         "${leadActor}",
     );`;

  const dbResponse = await db.run(addMovie);
  const movieId = dbResponse.lastID;
  response.send("Movie Successfully added");
});

// API GET METHOD -movieID

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
    SELECT 
    *
    FROM 
    movie
    WHERE
    movie_id = ${movieId};`;

  const movieResponse = await db.get(getMovieQuery);
  response.send(movieResponse);
});
