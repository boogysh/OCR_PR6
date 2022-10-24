# 
To run frontend -> go to  frontend -> 
1.npm install 
2.npm start  
frontend server turn on port 4200

to run backend -> install all dependencies from package.json
go to backend folder

npm instal -g nodemon
npm install --save bcrypt
npm install --save dotenv
npm install --save express
npm install --save express-mongo-sanitize
npm install --save express-rate-limit
npm install --save helmet
npm install --save hpp
npm install --save jsonwebtoken
npm install --save mongoose
npm install --save mongoose-unique-validator
npm install --save morgan
npm install --save multer
npm install --save password-validator
npm install --save validator
npm install --save xss-clean
-----
to run application use "nodemon server"
backend server turn on port 3000  
---
go to backend folder -> create a root file ".env" to connect the app to database MongoDB Atlas. 
in the ".env" you must write this:

MONGO_DB_USER = "new_test_user"
MONGO_DB_PASSWORD = "00OufiW6hwCvZWxu"
MONGO_DB_LEVEL_ACCESS = "?retryWrites=true&w=majority"
RANDOM_TOKEN = "RANDOM_TOKEN_JWT"                        
RANDOM_TOKEN_VALABILITY = "24h"


