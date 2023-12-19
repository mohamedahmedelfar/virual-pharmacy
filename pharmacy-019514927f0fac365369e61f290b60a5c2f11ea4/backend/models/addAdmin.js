const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AddAdmin = new Schema({  
    AdminUserName: {
        type: String,
        required: true
    },
   AdminPassword: { 
        type: String,
        required: true
    },
}, {timestamps: true})

module.exports=mongoose.model('AddAdmin', AddAdmin)
  