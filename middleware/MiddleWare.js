var userSchema = require('../model/Product');
var path = require('path');
var nodemailer = require('nodemailer');
var client = require('twilio')('AC3b07d99c3b4c0eb4963c55cc4fdec3bd','33e960903d1028b46eb8140e986010a0');
var join = path.join;
var mkdirp = require('mkdirp');
var rmdir = require( 'rmdir' );
var fs = require('fs');
var S3FS=require('s3fs');
var adminEmailArray=['tiwari.deepak254@gmail.com','duttgirish@gmail.com','manojjayara@gmail.com','joshi.manoj1985@gmail.com']
var s3fsImpl=new S3FS('products3d',{
	accessKeyId:'AKIAIFMYY4DHGM4EK6JA',
	secretAccessKey:'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'
 });
	



var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
    	user: "tiwari.deepak254@gmail.com",
        pass: "iphone6plus"
    }
});


function isUserExists(email, mobile) {
	var isExists=0;
	userSchema.user.find({
		$or : [ {
			userEmailId : email
		}, {
			userMobileNumber : mobile
		} ]
	}, function(err, users) {
			isExists= users.length;
	});
	
	return isExists;
}


//middleware checks user should not be undefined
exports.checkReqUser=function(req,res,next){
	
	if(req.user == undefined)
		{
			req.flash('error','please login.');
			res.redirect('/home');
		}
	else{
		next();
	}
}
//middleware Ends

exports.setAdmin=function(req,res,next)
{
	console.log(req.user);
	if(req.user != undefined)
	{	
			if(adminEmailArray.indexOf(req.user.adminEmail) !== -1)
			{
				req.admin=req.user;
				next();
			}	
			else
			{
				res.redirect('/');
			}
	}
	else
		{
				req.flash('error','You must have to login to view.');
				res.redirect('/');
		}

}


//middleware checks user should not be undefined
exports.checkReqAdmin=function(req,res,next){
	console.log(req.admin);
	 if(req.admin == undefined)
		{
			req.flash('error','please login.');
			res.redirect('/');
		}
	else{
		next();
	}
}
//middleware Ends



exports.checkUserEmailExists=function(req,res,next)
	{
		//console.log(req.body);
		userSchema.user.find({userEmailId:req.body.email},function(err,emailUsers){
			
			if(emailUsers.length > 0)
			{
				req.flash('error','user with the same email already there');
				res.redirect('/home');
			}
			else
			{
				
				next();
			}
		});
		
	}
	
	

exports.checkUserMobileExists=function(req,res,next)
	{
		//console.log(req.body);
		userSchema.user.find({userMobileNumber:req.body.mobile},function(err,mobileUsers){
			
			if(mobileUsers.length > 0)
			{
				req.flash('error','user with the same mobile already there');
				res.redirect('/home');
			}
			else
			{
				
				next();
			}
		});
		
	}
	
	
	exports.uploadProductImage=function(req,res,next)
	{
			var productImage=req.files.productImage;
			var fileName= productImage.originalFilename;
			var imageUrl='https://s3.amazonaws.com/products3d/'+req.body.email+'/'+fileName;
			var pathToUpload = join(req.body.email,fileName);
			var stream=fs.createReadStream(productImage.path);
			return s3fsImpl.writeFile(pathToUpload,stream).then(function(){
				fs.unlink(productImage.path,function(err){
					if(err){
							req.flash('error','something went wrong while uploading product image.');
							if(req.user == undefined)
							{
							 res.redirect('/uploadRequirement');
							}
							else{
							   res.redirect('/dashboard');
							}
						}
				});
				req.files.productImage.path=imageUrl;
				next();
			});
			
	};
		
	
	
	
	exports.storeGuest=function(req,res,next)
	{
		userSchema.user.find({
			$or : [ {
				userEmailId : req.body.email
			}, {
				userMobileNumber :req.body.mobile
			} ]
		}, function(err, users) {
			if(err)
			{
					req.flash('error','something went wrong while saving details');
					res.redirect('/uploadRequirement');
			}
			if(users.length > 0)
			{
						users[0].UserProductCustom.push({
							customProductName:req.body.prodName,
							customProductDescription:req.body.prodDescription,
							customProductSize:'Medium',
							customProductImageLocation:[req.files.productImage.path],
							customProductOrderDetails:
							{
								OrderTime:new Date(),
								orderDetailStatus:'Placed'
							}	
						});
						users[0].save(function(err){
								if(err){
									req.flash('error','something went wrong while updating Record');
									res.redirect('/uploadRequirement');
								}
								else
								{
									next();
								}
							});
				
				}	//if ends
			else{
				
				var guest=new userSchema.user({
					
					userFirstName:req.body.firstName,
					userLastName:req.body.lastName,
					userEmailId:req.body.email,
					userAddress:req.body.address,
					userMobileNumber:req.body.mobile,
					userType:'Guest',
					userFrom:'OWN',
					UserProductCustom:[{
						
						customProductName:req.body.prodName,
						customProductDescription:req.body.prodDescription,
						customProductSize:'Medium',
						customProductImageLocation:[req.files.productImage.path],
						customProductOrderDetails:
							{
								OrderTime:new Date(),
								orderDetailStatus:'Placed'
							}	
					}]
						
				});
				guest.save(function(err){
						if(err){
							req.flash('error','something went wrong while saving details');
							res.redirect('/uploadRequirement');
						}
						else
							{
								next();
							}
						});
					
				
				
			}//else ends here
				
		
		});	
		
	}	
		
	
	
	
	
	
	exports.sendConfirmationEmail=function(req,res,next)
	{
	
		console.log(req.body);
		// setup e-mail data with unicode symbols
		var msgHtml="<b>"+req.files.productImage.path+"</b><br><br><strong>PRODUCT NAME: </strong><small>"+req.body.prodName+"</small>"
		var mailOptions = {
		    from: req.body.email, // sender address
		    to: "tiwari.deepak254@gmail.com", // list of receivers
		    subject: "inquiry from 3dprint.com", // Subject line
		    text: "Hello Admin.Enquiry for product "+req.body.prodName, // plaintext body
		    html: msgHtml // html body
		}

		// send mail with defined transport object
		smtpTransport.sendMail(mailOptions, function(error){
		    if(error){
		    	req.flash('error','Error while sending confirmation email');
		    	if(req.user == undefined)
				{
				 res.redirect('/uploadRequirement');
				}
				else{
				   res.redirect('/dashboard');
				}
		    	
		    }else{
		       next();
		    }

		    // if you don't want to use this transport object anymore, uncomment following line
		     //smtpTransport.close(); // shut down the connection pool, no more messages
		});
	}
	
	
	exports.sendEmailForContact=function(req,res,next)
	{
		//console.log(req.body);
		var msgHtml="<b>"+req.body.name+" has contacted you via printIn3d.com</b><br><br><strong>His Message: </strong><small>"+req.body.message+"</small><br><strong>His Email: </strong><small>"+req.body.email+"</small>"
		var mailOptions = {
		    from: req.body.email, // sender address
		    to: "tiwari.deepak254@gmail.com", // list of receivers
		    subject: req.body.subject, // Subject line
		    text: "Hello Admin.Enquiry for product " ,//body
		    html: msgHtml // html body
		}

		// send mail with defined transport object
		smtpTransport.sendMail(mailOptions, function(error){
		    if(error){
		    	req.flash('error','Error while sending contact email');
				res.redirect('/');
		    }else
		    {
		       next();
		    }

		    // if you don't want to use this transport object anymore, uncomment following line
		     //smtpTransport.close(); // shut down the connection pool, no more messages
		});

	}
	
	
	
exports.sendTextSMSToMobile=function(req,res,next)
{
		var toMobileNo='+91'+req.body.mobile;
		client.sms.messages.create({
		    to:toMobileNo,
		    from:'+12019043688',
		    body:'we have received your product Details.Get Back To you Soon.Thanks and Regards, From printIn3d Team.'
		}, function(error, message) {
		    // The HTTP request to Twilio will run asynchronously. This callback
		    // function will be called when a response is received from Twilio
		    // The "error" variable will contain error information, if any.
		    // If the request was successful, this value will be "falsy"
		    if (!error) {
		       
		        console.log('Success! The SID for this SMS message is:');
		        console.log(message.sid);
		        console.log('Message sent on:');
		        console.log(message.dateCreated);
		        next();
		    } else {
		    	
		    	req.flash('error','Your order is been taken but error on sending confirmation text on Your mobile No');
				if(req.user == undefined)
				{
				 res.redirect('/uploadRequirement');
				}
				else{
				   res.redirect('/dashboard');
				}
		    	
		    }
		});
		
	}
		

	
	exports.uploadOwnProductImage=function(req,res,next){
		  var jsonData=req.body.hdnProd;
		  var prodData=JSON.parse(jsonData);
		  var productImage=req.files.prodImage;
		  var fileName= productImage.originalFilename;
		  var imageUrl=prodData.prodName+'/'+fileName;
		  var pathToUpload = join("ownProducts/"+prodData.prodName,fileName);
		  var stream=fs.createReadStream(productImage.path);
		  
		  return s3fsImpl.writeFile(pathToUpload,stream).then(function(){
		   fs.unlink(productImage.path,function(err){
		    if(err){
		      req.flash('error','something went wrong while uploading product image.');
		      res.redirect('/uploadRequirement');
		     }
		   });
		   req.files.prodImage.path=imageUrl;
		   next();
		  });
		 }
	