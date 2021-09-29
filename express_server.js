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

// const findUserByEmail = (email) => {
//   for (const username in users) {
//     const user = users[username];
//     if (user.email === email) {
//       return user;
//     }
//   }
//   return null;
// }

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// const users = {
//   123: {
//     id: 123,
//     email: saamk,
//     password: abcd,
//   }
// }

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/login", (req, res) => {
  // const email = req.body.email;
  // const password = req.body.password;
  // if (!email || !password) {
  //   return res.status(400).send("email or password cannot be blank");
  // }
  // const user = findUserByEmail (email);
  // if (!user) {
  //   return res.status(400).send("email not found");
  // }
  // if (user.password !== password) {
  //   return res.status(400).send("wrong password");
  // }

  res.cookie('username', req.body.username);
  res.redirect("/urls") // redirect to secrets.ejs
  // console.log(req.body.username)
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

// app.post('/register', (req, res) => {
//   const email = req.body.email;
//   const password = req.body.password;

//   if (!email || !password) {
//     return res.status(400).send("email or password cannot be blank");
//   }

//   const user = findUserByEmail(email);

//   if (user) {
//     return res.status(400).send("user with that email currently exists");
//   }

//   const id = Math.floor(Math.random() * 2000) + 1;

//   users[id] = {
//     id: id,
//     email: email,
//     password: password
//   }

//   res.redirect("urls");
// });

app.post("/logout", (req,res) => {
  // res.cookie('username', req.body.username);
  res.clearCookie('username', req.body.username);
  res.redirect("urls");
});

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

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls", (req, res) => {
  const username = req.cookies.username
  const templateVars = { 
    username,
    urls: urlDatabase };
    res.render("urls_index", templateVars);
  });
  
app.get("/urls/new", (req, res) => {
  const username = req.cookies.username
  const templateVars = { 
    username };
    res.render("urls_new", templateVars);
    // res.redirect("urls");
 });
    
app.get("/urls/:shortURL", (req, res) => {
  const username = req.cookies.username;
  const templateVars = { 
    username,
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