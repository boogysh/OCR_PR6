const Sauce = require('../models/Sauce')
const fs = require('fs');
const mongoose = require('mongoose');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);  
  console.log("sauceObject", sauceObject)
  delete sauceObject.userId   //delete this one, for security reason
  delete sauceObject._id      //undefined      for security reason, 
  const initialisation = {
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  };
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    ...initialisation
  });
  console.log("sauce", sauce)
  sauce.save()
  .then((sauce) => {
    if(!sauce){
      res.status(400).json({message:'Sauce does not created'})
    }
    res.status(201).json({message: 'Sauce created!'})
  })
  .catch(error =>{
    if(error instanceof mongoose.CastError){
      res.status(400).json({message:'Please complete all fields'})
      return
    }
    res.status(400).json({error})
  })
}
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  console.log("sauce object:", sauceObject)
  delete sauceObject.userId;
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      if(!sauce){
        res.status(400).json({message:'sauce does not exist'}) // null
        return
      }
      const immuable = {
        likes: sauce.likes,
        dislikes: sauce.dislikes,
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked
      }
      if (sauce.userId != req.auth.userId) {
          res.status(403).json({ message : 'Not authorized'});
      } 
      else {
        Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id, ...immuable })
        .then(() => res.status(200).json({message : 'Sauce modified!'}))
        .catch(error => res.status(401).json({ error }));
      }
    })
    .catch(error => {
      if(error instanceof mongoose.CastError){
        res.status(400).json({message:'Invalid sauce Id'})
        return
      }
      res.status(400).json({ error });
    });
};
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
  .then(sauce => {
    if(!sauce){
      res.status(400).json({message:'sauce does not exist'}) // null, status:200
    }
    if (sauce.userId != req.auth.userId) {
        res.status(403).json({message: 'Not authorized'});
    } 
    else {
      const filename = sauce.imageUrl.split('/images/')[1]; 
      console.log(sauce.imageUrl)
      console.log(filename)
      fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({_id: req.params.id})
              .then(() => { res.status(200).json({message: 'Sauce deleted !'})})
              .catch(error => res.status(401).json({ error }));
      });
    }
  })
  .catch( error => {
    if(error instanceof mongoose.CastError){
      res.status(400).json({message:'Invalid sauce Id'})
      return
    }
    res.status(500).json({ error });
  });
};
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    if(!sauce){
      res.status(404).json({message:'Sauce does not exist'}) // null, status 200
      return
    }
    res.status(200).json(sauce)
  })
  .catch(error => {
    if(error instanceof mongoose.CastError){
      res.status(400).json({message:'Invalid sauce Id'})
      return
    }
    res.status(404).send({ error })
    
  });
}
exports.getSauce = (req, res, next) => {
  Sauce.find()
  .then(sauces => res.status(200).json(sauces))
  .catch(error => res.status(400).json({ error }));
}
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if(!sauce){
          res.status(400).json({message:'sauce does not exist'}) // null, status 200
        }
        //console.log(req.body.like)   //-1, 0, 1
        let voteStatus;
        const voteUser = req.body.userId;
        //console.log(req.body.userId)
        const usersLiked = sauce.usersLiked;
        const usersDisiked = sauce.usersDisliked;
        //.includes return true or false
        const voteUser_in_usersLiked = usersLiked.includes(voteUser);
        const voteUser_in_usersDisliked = usersDisiked.includes(voteUser);
        if (voteUser_in_usersLiked === true) {
          voteStatus = "voted_like"; 
        } else if (voteUser_in_usersDisliked === true) {
          voteStatus = "voted_unLike";
        } else {
          voteStatus = "not_voted";
        }
        //---------Vote,first time----------
        if (voteStatus === "not_voted" && req.body.like === 1) {
          sauce.likes += 1;
          sauce.usersLiked.push(voteUser);
        } else if (voteStatus === "not_voted" && req.body.like === -1) {
            sauce.dislikes += 1;
            sauce.usersDisliked.push(voteUser);
        }
        //---------Vote, remove his like or dislike----------
        else if (voteStatus === "voted_like" && req.body.like === 0) {
          sauce.likes -= 1;
          const updateUsersLiked = usersLiked.filter((f) => f != voteUser);
          sauce.usersLiked = updateUsersLiked;
        } else if (voteStatus === "voted_unLike" && req.body.like === 0) {
          sauce.dislikes -= 1;
          const updateUsersDisliked = usersDisiked.filter((f) => f != voteUser);
          sauce.usersDisliked = updateUsersDisliked;
        }
        else {
          res.status(403).json({ message : 'You are not authorized to vote'});
          return
        }
        Sauce.updateOne(
          { _id: req.params.id },
          {
            likes: sauce.likes,
            dislikes: sauce.dislikes,
            usersLiked: sauce.usersLiked,
            usersDisliked: sauce.usersDisliked,
          }
        )
        .then(() => res.status(201).json({ message: "You have successfully voted" }))
        .catch(error => console.log(error));
      })
  .catch(error => {
    if(error instanceof mongoose.CastError){
      res.status(400).json({message:'Invalid sauce Id'})
    }
    res.status(404).json({ error })
  }); 
};


            
            
           

        
    
    
    


    

    

        
   
    
    
        
        
    

        
    

