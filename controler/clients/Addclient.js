const clientSchema = require('../../model/clientschema')
const Addclient = async (req , res) => {
    try {
        const {image , name , email , governorate , phonNumber , phonenumber2 , title , cardnumber} = req.body
        const founduser = await clientSchema.find({name:name})
        if(founduser.length > 0) {
          return  res.status(403).send("this client is extists before")
        } else{
            const avater  = "https://ps.w.org/user-avatar-reloaded/assets/icon-128x128.png?rev=2540745"
            const newClient = await clientSchema.create({
               image: image || avater,
                name,
                email,
                governorate,
                phonNumber,
                phonenumber2,
                title,
                cardnumber
            })
          return  res.json({newClient})
        }
       
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = Addclient
