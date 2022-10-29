# P6 OPENCLASSROOMS

## Install the project

1. Clone this repository
2. Install node.js
3. Install Angular CLI

## Frontend

To run frontend -> go to  frontend -> 

1. npm install 
2. to run the server use "npm start"  

frontend server turn on port 4200
http://localhost:4200/

## Backend

to run backend -> install all dependencies from package.json
go to backend folder

1. npm install -g nodemon;

2. npm install --save bcrypt dotenv express express-mongo-sanitize express-rate-limit helmet hpp jsonwebtoken mongoose mongoose-unique-validator morgan multer password-validator validator xss-clean

3. to run the server use "nodemon server"
backend server turn on port 3000  

4. go to backend folder -> create a root file ".env" to connect the app to database MongoDB Atlas. 
in the ".env" you must write this:
````text
MONGO_DB_USER = "new_test_user"
MONGO_DB_PASSWORD = "00OufiW6hwCvZWxu"
MONGO_DB_LEVEL_ACCESS = "?retryWrites=true&w=majority"

RANDOM_TOKEN = "THIS_IS_TOP_SECRET_AND_SAFTY"                        
RANDOM_TOKEN_VALABILITY = "24h"

````


