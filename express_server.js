//Dependencies//
const express = require("express");
const { findUserByEmail, generateRandomString, urlsForUser } = require("./helpers");
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080;
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ["key1"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

//Databases//
const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "aJROIx"
  },
  "9sm5xK": {
    longURL: "http://www.google.com",
    userID: "aJROIx"
  }
};

const userDB = {
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
};
//Endpoints//
app.get("/", (req, res) => {
  const id = req.session["user_id"];
  const user = userDB[id];
  if (!user) {
    res.redirect("/login");
    return;
  }
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  // const id = req.session["user_id"];
  // const user = userDB[id];
  if (req.session["user_id"]) {
    return res.redirect("/urls");//changed /login
  }
  
  const templateVars = { user: userDB[req.session["user_id"]] };

  res.render("urls_login", templateVars);
  // res.redirect("urls_registration")
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(403).send("email or password cannot be blank");
  }
  const user = findUserByEmail(email, userDB);
  
  if (!user) {
    return res.status(403).send("email not found");
  }

  const hashedPassword = userDB[user.id]['password'];
  
  if (!bcrypt.compareSync(req.body.password, hashedPassword)) {
    return res.status(403).send("wrong password");
  }

  req.session["user_id"] = user.id;
  res.redirect("/urls");
});

app.post("/logout", (req,res) => {
  req.session["user_id"] = null;
  res.redirect("/login"); //changed from /urls
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  if (!email || !password) {
    return res.status(400).send("email or password cannot be blank");
  }
  
  const user = findUserByEmail(email, userDB);
  
  if (user) {
    return res.status(400).send("user with that email currently exists");
  }
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  const id = generateRandomString();
  userDB[id] = { id, email, password: hashedPassword };
  
  req.session["user_id"] = id;
  res.redirect("urls");
});

app.post("/urls/:shortURL/", (req, res) => {
  const longURL = req.body.longURL;
  const userID = req.session["user_id"];

  urlDatabase[req.params.shortURL] = {
    longURL: longURL,
    userID: req.session.user_id
  };

  if (!userID) {
    res.status(401).send("please log in");
    return;
  }

  const result =  urlsForUser(userID, urlDatabase);
  
  if (result) {
    res.redirect("/urls");
    return;
  }
});

app.post("/urls", (req, res) => {
  const id = req.session.user_id;
  const user = userDB[id];
  if (!user) {
    return res.redirect("/login", 401);
  }

  const shortURL = generateRandomString();

  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id
  };
  res.redirect(`/urls/${shortURL}`);
});

app.get("/register", (req, res) => {
  const id = req.session.user_id;
  const user = userDB[id];
  const templateVars = { user };
  res.render("urls_registration", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const URL = urlDatabase[req.params.shortURL];
  if (!URL) {
    return res.status(404).send("short URL does not exist");
  }
  res.redirect(URL.longURL);

});

app.get("/urls", (req, res) => {
  const id = req.session["user_id"];
  const user = userDB[id];
  const urls = urlsForUser(id, urlDatabase);
  if (!user) {
    return res.status(401).send("please login");
  }
  const templateVars = { user, urls: urls };
  res.render("urls_index", templateVars);
});
  
app.get("/urls/new", (req, res) => {
  const id = req.session.user_id;
  const user = userDB[id];
  const templateVars = { user };
  if (!user) {
    return res.redirect("/login", 401);
  } else {
    res.render("urls_new", templateVars);
  }
});
    
app.get("/urls/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  if (!longURL) {
    return res.status(403).send("please log in");
  }

  const id = req.session.user_id;
  const user = userDB[id];
  const templateVars = {
    user,
    shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL };
  res.render("urls_show", templateVars);
});
      
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
      
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.session["user_id"];
  
  if (!userID) {
    res.status(401).send("please log in");
    return;
  }
  const result =  urlsForUser(userID, urlDatabase);
  
  if (result) {
    delete urlDatabase[shortURL];
    res.redirect("/urls");
    return;
  }
 
});
      
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
      
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});