const mongoose = require('mongoose');
const permission = mongoose.Schema({
    permissionName: {
      type: String  
    },
    details:{
      type: String
    },
    pagePermissions: [{
      pageName: {
        type: String,
       
      },
      actions: {
        add: {
          type: Boolean,
          default: false
        },
        watch: {
          type: Boolean,
          default: false
        },
        update: {
          type: Boolean,
          default: false
        },
        delete: {
          type: Boolean,
          default: false
        }
      }
    }]
  } , {
    timestamps: true
  });
  const permissionschema = mongoose.model("permission"  ,permission);
  module.exports = permissionschema