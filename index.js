const express=require("express");
const bodyParser = require("body-parser")
const app=express();
const mongoose = require("mongoose");

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

const homeStartingContent = "This project has been made using node, express, mongodb and bootstrap. The native mongodb driver was not used instead mongoose was used in it's place. This is a productivity application which has a todolist along with note taking capabilities. This also has a small game inside the website itself to to relax in between work hours.";

const mongoDB="mongodb://127.0.0.1:27017/todolistDB";

mongoose.connect(mongoDB,(err) => {
    if(err){
        console.log("ERROR!!!!!!!!!!!!");
    }
    else{
        console.log("CONNECTED!!!!!!!!!!");
    }
});

const itemsSchema= {
    name: String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name: "Welcome to your To do list"
});

const item2 = new Item({
    name: "Hit + to add a new item"
});

const postSchema = {
    title: String,
    content: String
};

const Post = mongoose.model("Post", postSchema);




// Item.insertMany(defaultItems,function(err){
//     if(err) console.log(err);
// });


app.get("/",function(req,res){
    var today = new Date();
    
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US",options);

    Item.find({},function(err,foundItems){
        if(err) console.log(err);
        else{

            if(foundItems.length === 0){
                const defaultItems=[item1,item2];
                Item.insertMany(defaultItems,function(err){
                    if(err) console.log(err);
                });  
            }


        res.render("list",{listTitle:day,newListItem:foundItems});
        }
    });

   
})

app.post("/",function(req,res){
    var itemName = req.body.newItem;
    
    const item = new Item({
        name: itemName
    });

    item.save();

    res.redirect("/");
});

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId,function(err){
        if(!err){
            console.log("Successfully deleted");
            // res.rederict("/");
        }
    });
});

app.get("/drum", function(req, res){
    res.render("drum");
  });


app.get("/home", function(req, res){
    Post.find({}, function(err, posts){
        res.render("home", {
          startingContent: homeStartingContent,
          posts: posts
          });
      });
  });

  app.get("/home/compose", function(req, res){
    res.render("compose");
  });


  app.post("/home/compose", function(req, res){
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
      });
    
    
      post.save(function(err){
        if (!err){
            console.log(req.body.postTitle);
            console.log(req.body.postBody);
            res.redirect("/home");
        }
      });
  });

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;
    
      Post.findOne({_id: requestedPostId}, function(err, post){
        res.render("post", {
          title: post.title,
          content: post.content
        });
      });
    
});


app.listen(7000,function(){
    console.log("Server started");
}); 