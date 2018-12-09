var express = require("express"),
    User = require("../models/user"),
    passport = require("passport"),
    router = express.Router();

router.get("/",function(req,res){
   res.render("landing"); 
});



// ========
// AUTH ROUTES
// ========

//show register form
router.get("/register",function(req, res) {
   res.render("register"); 
});

//sign up logic
router.post("/register",function(req, res) {
   var newUser = new User({username:req.body.username});
   User.register(newUser,req.body.password,function(err,user){
       if(err){
           req.flash("error",err.message);
           res.render("register");
       }
       else{
           passport.authenticate("local")(req,res,function(){
              req.flash("success","Welcome, to Yelpcamp"+user.username);
              res.redirect("/campgrounds"); 
           });
       }
   })
});

//login form
router.get("/login",function(req,res){
   res.render("login"); 
});

//login logic
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){
    
});

//LOGOUT
router.get("/logout",function(req, res) {
   req.logout();
   req.flash("success","Logged you out");
   res.redirect("/campgrounds");
});


module.exports = router;