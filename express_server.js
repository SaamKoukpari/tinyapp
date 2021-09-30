const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require('morgan');
const bodyParser = require("body-parser");

const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan('dev'));
app.set("view engine", "ejs");

const generateRandomString = function(length = 6) {
  return Math.random().toString(36).substr(2, length) 
};

const findUserByEmail = (email) => {
  for (const user_id in users) {
    const user = users[user_id];
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple",
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "monkey"
  }
}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/login", (req, res) => {
  const id = req.cookies["user_id"];
  const user = users[id];
  const templateVars = { user };
  if (id) {
    res.redirect("/login")
  }
  
  res.render("urls_login", templateVars);
  // res.redirect("urls_registration")
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(403).send("email or password cannot be blank");
  }
  const user = findUserByEmail (email);
  if (!user) {
    return res.status(403).send("email not found");
  }
  if (user.password !== password) {
    return res.status(403).send("wrong password");
  }

  console.log(user)
  res.cookie("user_id", user.id);
  res.redirect("/urls") // redirect to secrets.ejs
  // console.log(req.body.username)
});

app.post("/logout", (req,res) => {
    res.clearCookie('user_id');
  res.redirect("/urls");
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("email or password cannot be blank");
  }

  const user = findUserByEmail(email);

  if (user) {
    return res.status(400).send("user with that email currently exists");
  }

  const id = generateRandomString();
  users[id] = { id, email, password };
  
  res.cookie("user_id", id)
  console.log(user)
  res.redirect("urls");
});

// app.get('/secrets', (req, res) => {
//   const userId = req.cookies.username;

//   if (!username) {
//     return res.status(401).send("you are not logged in")
//   } 

//   const user = users[username];
//   const templateVars = { email: user.email }

//   if (!user) {
//     return res.status(400).send("you have an old cookie");
//   }

//   res.render("secrets", templateVars);
// });


app.post("/urls/:shortURL/", (req, res) => {
  const longURL = req.body.longURL;
  urlDatabase[req.params.shortURL] = longURL
  res.redirect("/urls");
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString()
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/register", (req, res) => {
  const id = req.cookies.user_id;
  const user = users[id];
  const templateVars = { user };
    res.render("urls_registration", templateVars);
  });

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  const id = req.cookies["user_id"]
  const user = users[id];
  const templateVars = { user, urls: urlDatabase };
    res.render("urls_index", templateVars);
  });
  
app.get("/urls/new", (req, res) => {
  const id = req.cookies.user_id
  const user = users[id];
  const templateVars = { 
    user };
    res.render("urls_new", templateVars);
    // res.redirect("urls");
 });
    
app.get("/urls/:shortURL", (req, res) => {
  const id = req.cookies.user_id;
  const user = users[id];
  const templateVars = { 
    user,
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
    res.render("urls_show", templateVars);
    res.redirect("urls");
  });
      
app.get("/urls.json", (req, res) => { 
  res.json(urlDatabase);   
});
      
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls"); 
});
      
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
      
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});