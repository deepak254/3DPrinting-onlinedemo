 var mongoose = require('mongoose');
var userSchema=new mongoose.Schema({
	
				userName:{type:String,unique:true},
				password:String,
				email: {type:String,unique:true},
				address: String,
				pincode:Number,
				state:String,
				city:String,
				from:String,
				mobile:{type:Number,unique:true}
	
 });

module.exports=mongoose.model('userTable',userSchema);