const auth_Uther = require("../../model/userschema");
const bcrypt = require("bcrypt");
const updateEmployer = async (req , res) => {
    try {
        const {id} = req.params
        const { name,email, password ,image  , role , permissions} = req.body;
        const employer = await auth_Uther.findById(id).select("-password").populate("permissions")
        if(employer.length){
          return  res.send("this employer not found ")
        }
        if(password){
            const hashPassword = await bcrypt.hash(password, 10);
              const update = await auth_Uther.findByIdAndUpdate(id , {
                name,
                permissions,
                email,
                password: hashPassword,
                role,
                image
            } , {new:true})
            return  res.json(update)
        }else{
            const update = await auth_Uther.findByIdAndUpdate(id , {
                name,
                permissions,
                email, 
                role,
                image
            } , {new:true})
            return  res.json(update)
        }
      
     
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = updateEmployer