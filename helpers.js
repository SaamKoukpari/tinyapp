const findUserByEmail = (email, database) => {
  for (const user_id in database) {
    const user = database[user_id];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

const generateRandomString = function(length = 6) {
  return Math.random().toString(36).substr(2,length);
};

const urlsForUser = (id, database) => {
  const userUrlObj = {};

  for (const shortURL in database) {
    if (database[shortURL].userID === id) {
      userUrlObj[shortURL] = database[shortURL];
    }
  }
  return userUrlObj;
};

module.exports = { findUserByEmail, generateRandomString, urlsForUser };