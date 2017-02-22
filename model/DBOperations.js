var mongoose = require('mongoose');
//var db = mongoose.connect('mongodb://localhost/3ddb');
var db = mongoose.connect('mongodb://deepak:Girish123@ds011870.mlab.com:11870/3ddb');

var dateFormat = require('dateformat');
var connection=mongoose.connection;
connection.on('error',function(msg){
	//dbMsg=msg;
	console.log(msg);
});
connection.once('open',function(msg){
	console.log('connection succeeded');
});

var productSchema = require('../model/Product');


exports.checkUserExistance=function(email,mobile,res,next)
{
	
	productSchema.user.find({userEmailId:email},function(err,emailUsers){
		
			if(emailUsers.length > 0)
			{
				res.send('user already there')
			}
			else
			{
				
				return false;
			}
		
	});
	
}


exports.persistUserInfo=function(fName,lName,password,email,mobile)
							  {
									var ownUser=new productSchema.user({
										userFirstName:fName,
										userLastName:lName,
										userPassword:password,
										userEmailId:email,
										userMobileNumber:mobile,
										userType:'Permanent',
										userFrom:'OWN',
										});
									  ownUser.save(function(error){
										if(error){
										throw error;
										}
										console.log("user persist");
									});
							}


exports.getAllUsers=function(){
	productSchema.find({},function(err,users){
		
		console.log(users);
		return users;
		
	});
	
}



exports.saveProduct = function(objProd,imgUrl){
	var day=dateFormat(new Date(), "dd-mm-yyyy");
	 console.log("date"+day);
	 var prodDetail=new productSchema.product({
	  productName:objProd.prodName,
	   productDescription: objProd.prodDesc,
	   productCategory:objProd.prodCategor,
	   productColor:objProd.prodColor,
	   productSize:objProd.prodSize,
	   productPrice:objProd.prodPrice,
	   productDiscount:objProd.prodDiscount,
	   productAvailability:objProd.prodAvailable,
	   productCreateDate:day,
	   productUnitInStock:objProd.prodUnits,
	   productWeight:objProd.prodWeight,
	   productValidFlag:'Y',
	   productImage:imgUrl
	  });
	 prodDetail.save(function(error){
	  if(error){
	  throw error;
	  }
	  console.log("Product Persist");
	 });
	}


	

 exports.getGalleryProducts = function(){
	 var productResult=[];
	 productSchema.product.find({},function(err, resultProducts){
	  //console.log("Dboperatons "+resultProducts);
	  productResult=resultProducts;
	 });
	 return productResult;
	};


function storeAdmin(adminUserName,adminUserEmail,adminUserPassword)
{
	 var admin=new productSchema.adminUser({
	
			adminName:adminUserName,
			adminEmail:adminUserEmail,
			adminPassword:adminUserPassword
		 
	 });
	 admin.save(function(error){
		  if(error){
		  throw error;
		  }
		  console.log("Admin Persist");
		 });
	 
}


//storeAdmin('Deepak Tiwari','tiwari.deepak254@gmail.com','Zgraphy@2016');
//storeAdmin('Girish Dutt','duttgirish@gmail.com','Zgraphy@2016');
//storeAdmin('Manoj Jayara','manojjayara@gmail.com','Zgraphy@2016');
//storeAdmin('Manoj Joshi','joshi.manoj1985@gmail.com','Zgraphy@2016');
