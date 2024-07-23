const auth_Uther = require("../model/userschema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register functionalty
// const reqister = async (req, res) => {
//   const { name,email, password   , role , permissions} = req.body;
//   try {
//     if (!name || !email || !password ) {
//       return res.status(404).json({ mesg: "pleas aded a requier value" });
//     }
//     const foundUser = await auth_Uther.findOne({ email });
//     // check if this user is aready exists
//     if (foundUser) {
//     return  res
//         .status(401)
//         .json({ mesg: "this email is used before pleas aded a another email " });
//     }
//     const hashPassword = await bcrypt.hash(password, 10);
//     // hash password and create new user in mongodb
//     const User = await auth_Uther.create({
//       name,
//       permissions,
//       email,
//       password: hashPassword,
//       role,
//     });
   
 
  
//     // finaly send the respones for frontend 
//     res.status(200).json({
//       mesg: " user aded successfully created",
//       usernamw: User.first_name,
//       userEmail:User.email,
//       role:User.role
//     });
//   } catch (error) {
//     throw new Error(error)
//   }

// };

const login  = async (req , res) => {
  const { email , password} = req.body
  if(!email || !password){
   return res.status(404).json({mesg:"values are requierd"})
  }
  const foundUser = await auth_Uther.findOne({email})
  if(!foundUser){
   return res.status(404).json({mesg:"email or password are wrong !"})
  }
  const match = await bcrypt.compare(password , foundUser.password)
  if(!match){
    return res.status(404).json({mesg:"email or values are wrong bassword"})
  }
 

  const refrash_Token = jwt.sign({
    id:foundUser._id
  } , process.env.REFRASH_TOKEN,{expiresIn:"14d"})
  res.cookie("jwt" , refrash_Token, {
    httpOnly:true,
    sameSite:"none",
    secure:true,
    maxAge:14* 24 * 60 * 60 * 1000,
  })
  res.status(200).json(
    {mesg:"user login successful" , 
      foundUser
     ,Token:refrash_Token})
}
const logout = async (req , res) => {
  res.cookie("jwt" , "", {
    httpOnly:true,
    expires:new Date()
  })
  res.json({mesg:"user logout sucssfuly"})
}

// get all users
const getUsers = async(req, res) => {
  const users  =  await auth_Uther.find().select("-password").populate("permissions")
  if(!users.length){
  return  res.send("there is no users aded in the database")
  }
res.json(users);
};
module.exports = {
  getUsers,
  // reqister,
  login,
  logout
};
