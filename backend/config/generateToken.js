const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "900d",
  });
};

module.exports = generateToken;
//jsonwebtoken i.e JWT helps the user to authorise in backend for eg .. user logged in and try to  acessing a resource which is only available to him
//so user will send it to JWT and JwT will send it to backend that this is the user and it is authorised to acess this resource
//then only user is authorise or allowed to use this resource
