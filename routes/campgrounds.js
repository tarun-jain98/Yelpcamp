var express = require("express"),
    Campground = require("../models/campground"),
    router = express.Router({mergeParams:true}),
    middleware = require("../middleware");

//INDEX
router.get("/",function(req,res){
    //get all campgrounds
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
   
});

//CREATE
router.post("/",middleware.isLoggedIn,function(req,res){
    //get data from form and add to array
    var name = req.body.name;
    var image = req.body.image;
    var cost = req.body.cost;
    var description = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username 
    };
    var newcampground = {name:name,image:image,cost:cost,description:description,author:author};
    //add camp
    Campground.create(
        newcampground,
        function(err,newlyCreated){
          if(err){
              console.log(err);
          }
          else{
                //redirect to campgrounds
                res.redirect("/campgrounds");
          }
        }
    );

    
});

//NEW
router.get("/new",middleware.isLoggedIn,function(req, res) {
   res.render("campgrounds/new"); 
});

//SHOW
router.get("/:id",function(req, res) {
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundcampground){
       if(err){
           console.log(err);
       }
       else{
           res.render("campgrounds/show",{campground:foundcampground}); 
       }
   });
   
});

//EDIT
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
   Campground.findById(req.params.id,function(err,foundcampground){
       if(err){
           res.redirect("/campgrounds");
       }
       else{
          res.render("campgrounds/edit",{campground:foundcampground});  
       }
   });
   
});

//UPDATE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       }
       else{
           res.redirect("/campgrounds/"+req.params.id);
       }
   }) 
});

//DELETE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
   Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/campgrounds");
       }
       else{
           res.redirect("/campgrounds");
       }
   }) 
});



module.exports = router;