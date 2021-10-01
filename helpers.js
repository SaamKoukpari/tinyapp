
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



const findUserByEmail = (email, database) => {
  for (const user_id in userDB) {
    const user = database[user_id];
    if (user.email === email) {
      return user;
    }
  }
  return null;
}; 

module.exports = { findUserByEmail };