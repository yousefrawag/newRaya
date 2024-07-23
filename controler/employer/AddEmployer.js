const auth_Uther = require("../../model/userschema");
const bcrypt = require("bcrypt");
const AddEmployer = async (req , res) => {
    const { name,email, password   , role , permissions , image} = req.body;
    try {
      if (!name || !email || !password ) {
        return res.status(404).json({ mesg: "pleas aded a requier value" });
      }
      const foundUser = await auth_Uther.findOne({ email });
      // check if this user is aready exists
      if (foundUser) {
      return  res
          .status(401)
          .json({ mesg: "this email is used before pleas aded a another email " });
      }
      const hashPassword = await bcrypt.hash(password, 10);
      // hash password and create new user in mongodb
      const User = await auth_Uther.create({
        name,
        permissions,
        email,
        password: hashPassword,
        role,
        image
      });
     
   
    
      // finaly send the respones for frontend 
      res.status(200).json({
        mesg: " user aded successfully created",
        usernamw: User.first_name,
        userEmail:User.email,
        role:User.role
      });
    } catch (error) {
      throw new Error(error)
    }
  
}
module.exports = AddEmployer