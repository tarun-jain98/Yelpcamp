var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    Campground = require("./models/campground"),
    Comment   = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");
//seed database
// seedDB();
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"
mongoose.connect(url,{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true})) ;
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
app.use(flash());
app.use(methodOverride("_method"));

//PASSPORT CONFIGURATION

app.use(require("express-session")({
    secret:"hello there",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The yelpcamp server has started");
});