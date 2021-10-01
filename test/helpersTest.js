const { assert } = require('chai');
const { findUserByEmail, generateRandomString, urlsForUser } = require('../helpers.js');


const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const testDatabase = {
  'shortURLTest': {
    longURL: 'longURL',
    userID: 'userRandomID',
  },
  'shortURLTest2': {
    longURL: 'longerURL',
    userID: 'user2RandomID',
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserByEmail("user@example.com", testUsers)
    const expectedOutput = "user@example.com"
    assert.equal(user.email, expectedOutput);
  });
  it('should return undefined for a user with invalid email', function() {
    const user = findUserByEmail("jack@gmail.com", testUsers)
    const expectedOutput = undefined
    assert.equal(user, expectedOutput);
  });
});

describe('generateRandomString', function() {
  it('should return a string with 6 characters', function() {
    assert.strictEqual(generateRandomString().length, 6);
  });
});

describe('urlsForUser', function() {
  it('should return an empty object if there are no matches', function() {
    const urls = urlsForUser('noMatch', testDatabase);
    const expectedOutput = '{}';
    assert.strictEqual(JSON.stringify(urls), expectedOutput);
  });
});
