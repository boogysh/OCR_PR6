const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const passwordSchema = require("../models/Password");
const validator = require("validator");

exports.signup = (req, res, next) => {
    const valideEmail = validator.isEmail(req.body.email);
    const validePassword = passwordSchema.validate(req.body.password);
    if (valideEmail  && validePassword ) {
      bcrypt
        //const salt = await bcrypt.genSalt(10);
        .hash(req.body.password, 10)
        .then((hash) => {
          const user = new User({
            email: req.body.email,
            password: hash,
          });
          user.save()
            .then(() => res.status(201).json({ message: "User created" }))
            .catch((error) => {
              if(error.code === 11000){
                res.status(400).json({message:'Duplicate field value entered'})
              return
              }
              res.status(400).json({ error })
            });
        })
        .catch((error) =>{
          res.status(400).json({ error })
        });
    } else {
        console.error("Email or password, invalid format");
        console.error(
            "invalid part of password :" +
              passwordSchema.validate(req.body.password, { list: true })
        );
        console.error(passwordSchema.validate('joke', { details: true }));
    }
  };
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    
       .then(user => {
           if (!user) {
               return res.status(403).json({ message: 'Paire login/mot de passe incorrecte'});
           }
           bcrypt.compare(req.body.password, user.password)
               .then(valid => {
                   if (!valid) {
                       return res.status(403).json({ message: 'Paire login/mot de passe incorrecte' });
                   }
                   //console.log(user._id)  //user._id new ObjectId("435d592bbd5e09ae1c830437")
                   res.status(200).json({
                       userId: user._id,
                       //userId must be encoded for a safty creation or modif. of sauces    
                       token: jwt.sign(
                        { userId: user._id},
                        process.env.RANDOM_TOKEN,
                        { expiresIn: process.env.RANDOM_TOKEN_VALABILITY } 
                       )
                   });
               })
               .catch(error => res.status(500).json({ error }));
       })
       .catch(error => res.status(500).json({ error }));
};


