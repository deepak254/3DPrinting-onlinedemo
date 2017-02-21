var mongoose = require('mongoose');

var adminUsers=new mongoose.Schema({

	adminName:{type:String,required:true},
	adminEmail:{type:String,unique:true,required:true},
	adminPassword:{type:String,required:true},
	adminRole:String,
	adminAccessRead:Boolean,
	adminAccessWrite:Boolean
	
})

exports.adminUser=mongoose.model('AdminUser',adminUsers);
console.log("Admin Schema Created");



var Product=new mongoose.Schema({
	 productName:String,
	 productDescription: String,
	 productCategory:String,
	 productColor:String,
	 productSize:String,
	 productPrice:Number,
	 productDiscount:Number,
	 productAvailability:Boolean,
	 productCreateDate:Date,
	 productUnitInStock:Number,
	 productWeight:Number,
	 productValidFlag:String,
	 productImage:[]
	 
 });
exports.product=mongoose.model('Products',Product);
console.log("Product Table Created");



var appUser=new mongoose.Schema({
	userFirstName:String,
	userLastName:String,
	userPassword:String,
	userEmailId:{type:String,unique:true,required:true},
	userAddress:String,
	userDistrict:String,
	userState:String,
	userPinCode:Number,
	userMobileNumber:{type:Number,unique:true,required:true},
	userType:String,
	userFrom:String,
	userProductOwn:[{
		productId:{type: mongoose.Schema.Types.ObjectId, ref: 'Products'},
		productOrderDetails:{
			OrderTime:Date,
			orderDetailStatus:String
			}
		}
	],
	UserProductCustom:[{
		customProductName:String,
		customProductDescription:String,
		customProductCategory:String,
		customProductColor:String,
		customProductSize:String,
		customProductImageLocation:[],
		customProductOrderDetails:{
				OrderTime:Date,
				orderDetailStatus:String
		}
	}],
	
	});
exports.user=mongoose.model('Users',appUser);
console.log("User Table Created");


