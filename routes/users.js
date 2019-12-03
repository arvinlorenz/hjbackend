const express = require('express');
const router = express.Router();
const User = require('../models/users');

const bcrypt = require('bcrypt'); //encryption funcitonalities
const jwt = require('jsonwebtoken');

router.get('', async(req,res,next)=>{
  User.find()
        .then(documents =>{
            fetchedUser = documents;
            return User.count();
        })
        .then(count=>{
            res.status(200).json({
                message: 'Users fetched successfully!',
                users: fetchedUser,
                maxUsers: count
            });
        })
        .catch(error=>{
            res.status(500).json({
                message: 'Fetching users failed'
            });
        });
});
router.post('', async(req,res,next)=>{
    let hash = await bcrypt.hash(req.body.password, 10);

    const userM = new User({
        username: req.body.username,
        password: hash,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        table_no: req.body.table_no,
        seat_no: req.body.seat_no,
        coming: req.body.accountType === 'admin' ? null : req.body.coming,
        accountType: req.body.accountType,
        companions: req.body.companions
    });

    try{
        let user = await userM.save();
        res.status(201).json({
            message: 'User Created',
            user
        });
    }
    catch(e){
      console.log(e);
        res.status(500).json({
            message: 'Invalid authentication credentials'
        });
    }
});
router.put('/:id', async(req,res,next) => {
    const user = new User({
        _id: req.params.id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        table_no: req.body.table_no,
        seat_no: req.body.seat_no,
        coming: req.body.coming,
        companions: req.body.companions
    });


    User.findByIdAndUpdate({_id: req.params.id}, user, {new: true})
        .then((result)=>{
          console.log(result);

            if(result){
                res.status(200).json({
                  message: 'Update successful',
                  user: result
                });
            }
            else{
                res.status(401).json({message: 'Not authorized'});
            }

        })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            message: "Couldn't update user"
        })
    })
});


router.delete('/:id', async(req,res,next)=>{
  console.log(req);
  User.deleteOne({ _id: req.params.id })
  .then((result)=>{
      console.log(result);
      if(result.n > 0){
          res.status(200).json({message: 'Deletion successful'});
      }
      else{
          res.status(401).json({message: 'Not authorized'});
      }
  })
  .catch(error=>{
      res.status(500).json({
          message: 'Deleting user failed'
      })
  })
});

router.post('/login', async(req,res,next)=>{
    try {
        let user = await User.findOne({username: req.body.username});
        if(!user){
            res.status(200).json({
                message: 'Auth failed'
            });
        }
        let result = await bcrypt.compare(req.body.password, user.password);
        if(!result){
            res.status(200).json({
                message: 'Auth failed'
            });
        }

        const token = jwt.sign(
            { username: user.username, userId: user._id},
                'JWSECRET',
                {expiresIn:'1h'}
            );

        res.status(200).json({
            accountType: user.accountType,
            user,
            token
        })

    } catch (error) {
        res.status(401).json({
            message: 'Auth failed'
        });
    }

});

module.exports = router;
