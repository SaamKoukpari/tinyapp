const express = require("express");
const cookieParser = require("cookie-parser");
// const morgan = require('morgan');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieParser());

const generateRandomString = function(length = 6) {
  return Math.random().toString(36).substr(2, length) 
};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect("/urls")
  console.log(req.body.username)
});

app.post("/logout", (req,res) => {
  res.cookie('username', req.body.username);
  res.clearCookie('username', req.body.username);
  res.redirect("urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
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
  res.redirect("urls");
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

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});