# Northen company


## Endpoints
<li>POST /games -> creates new game</li>
<li>GET /games/:id -> get specific game data</li>
<li>POST /games/:id/reinforce -> make reinforce phase</li>
<li>POST /games/:id/attack -> make attack phase or skip it depends on body of the POST</li>
<li>POST /games/:id/move -> make move phase</li>
<li>POST /games/:id/end-turn -> make end-turn phase</li>

## Database
Choosen DB is Subabase.
It is relative DB. And in this project we need DB with hard schema because we know the columns at start of project.
And supabase is more comfortable and simple to use on JS.
At all we need 2 tables.
<li>startTerritories -> to create game</li>
<li>gameStatus -> to track game status</li>

## Run
...