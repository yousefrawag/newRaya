const clientSchema = require('../../model/clientschema')
const updateClient = async (req , res) => {
    try {
        const {id} = req.params
        const {image , name , email , governorate , phonNumber , phonenumber2 , title , cardnumber} = req.body
        const update = await clientSchema.findByIdAndUpdate(id , {
            image:image || "https://ps.w.org/user-avatar-reloaded/assets/icon-128x128.png?rev=2540745",
            name,
            email,
            phonNumber,
            phonenumber2,
            title,
            governorate,
            cardnumber
        } , {new :true})
        res.json({update})
    } catch (error) {
        res.send(error.message)
    }
}
module.exports = updateClient