	/*******************************************************************************
	 * * This File Contains all low level routes info.
	 * 
	 * @author deepak tiwari
	 ******************************************************************************/
	
	var express = require('express');
	var flash = require('connect-flash');
	var LocalStrategy = require('passport-local');
	var bCrypt = require('bcrypt-nodejs');
	var path = require('path');
	var passport = require('passport');
	var url = require('url');
	var queryString = require("querystring");
	var FacebookStrategy = require('passport-facebook').Strategy;
	var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
	var multiparty = require('connect-multiparty'), multiPartyMiddleware = multiparty();
	
	var router = express.Router();
	router.use(multiPartyMiddleware);
	exports.router = router;
	var schema3d = require('../model/Product');
	var userModel = require('../model/DBOperations');
	var middleWareService = require('../middleware/MiddleWare');
	var authConfig = require('../config/config');
	
	
	
	
	/** ***********ADMIN AUTHENTICATION IMPLEMENTATION*********************/
	
	passport.use('admin-login',new LocalStrategy(verifyAdminCredentials));
	
	function verifyAdminCredentials(username, password, done) {
		// check in mongo if a user with username exists or not
		
		process.nextTick(function() {
			//console.log('admin star called '+username+','+password);
			schema3d.adminUser.find({
									adminEmail : username,
									adminPassword : password
			}, function(err, adminUsers) {
				//console.log(adminUsers.length);
				if (adminUsers.length === 1) {
					done(null, adminUsers[0]);
				} else {
					done(null, false);
				}
			});
	
		});
	}
	
	
	router.get('/doAdminLogin', passport.authenticate('admin-login', {
		session : true,
		successRedirect : '/home',
		failureRedirect : '/adminnotfound',
		failureFlash : true
	}));
	
	router.get('/logoutAdmin', function(req, res) {
		req.logout();
		req.admin = undefined;
		req.flash('info', 'You have successfully logged out.');
		res.redirect('/');
	});
	
	
	
/** ***********ADMIN AUTHENTICATION IMPLEMENTATION ENDS****************/
	
	
	
	
	/**
	 * ***********AUTHENTICATION IMPLEMENTATION****************************************
	 * ***************************************
	 */
	
	passport.serializeUser(function(user, done) {
		done(null, user);
	
	});
	passport.deserializeUser(function(user, done) {
	
		done(null, user);
	});
	
	// Local Authentication Strategy
	passport.use(new LocalStrategy(verifyCredentials));
	
	// Local Authentication Strategy implementation.
	function verifyCredentials(username, password, done) {
		// check in mongo if a user with username exists or not
	
		process.nextTick(function() {
	
			schema3d.user.find({
				$or : [ {
					userEmailId : username
				}, {
					userMobileNumber : username
				} ],
				userPassword : password
			}, function(err, users) {
				if (users.length === 1) {
					done(null, users[0]);
				} else {
					done(null, false);
				}
				;
			});
	
		});
	}
	
	// Facebook Authentication Strategy implementation.
	passport.use(new FacebookStrategy({
		clientID : authConfig.facebookAuth.clientID,
		clientSecret : authConfig.facebookAuth.clientSecret,
		callbackURL : authConfig.facebookAuth.callbackURL,
		profileFields : authConfig.facebookAuth.profileFields,
	}, function(accessToken, refreshToken, profile, done) {
	
		var facebookEmail = profile.emails[0].value;
		schema3d.user.find({
			userEmailId : facebookEmail
		}, function(err, users) {
	
			if (users.length === 0) {
	
				var facebookUser = new schema3d.user({
					userFirstName : profile.id,
					userEmailId : facebookEmail,
					userMobileNumber : 9999999999,
					userFrom : 'FACEBOOK',
					userType : 'Permanent'
				});
				facebookUser.save(function(err) {
					if (err) {
						done(null, false)
					} else {
						done(null, facebookUser)
					}
				});
	
			} else {
				done(null, users[0]);
			}
		});
	
	}));
	
	// Google Authentication Strategy implementation
	passport.use(new GoogleStrategy({
		clientID : authConfig.googleAuth.clientID,
		clientSecret : authConfig.googleAuth.clientSecret,
		callbackURL : authConfig.googleAuth.callbackURL,
	
	}, function(accessToken, refreshToken, profile, done) {
	
		// console.log(profile);
		var googleEmail = profile.emails[0].value;
		schema3d.user.find({
			userEmailId : googleEmail
		}, function(err, users) {
	
			if (users.length === 0) {
				var googleUser = new schema3d.user({
					userFirstName : profile.id,
					userEmailId : googleEmail,
					userMobileNumber : 9999999999,
					userFrom : 'GOOGLE',
					userType : 'Permanent'
				});
				googleUser.save(function(err) {
					if (err) {
						done(null, false)
					} else {
						done(null, googleUser)
					}
				});
	
			} else {
				done(null, users[0]);
			}
		});
	
	}));
	
	router.get('/', function(req, res) {
		res.render('login', {
			expressFlash : req.flash('info'),
			error : req.flash('error')
		});
	});
	
	
	
	
	router.get('/auth/facebook', passport.authenticate('facebook', {
		scope : [ 'email' ]
	}), function(req, res) {
	});
	router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect : '/dashboard',
		failureRedirect : '/usernotfound'
	}));
	
	router.get('/auth/google', passport.authenticate('google', {
		scope : [ 'profile', 'email' ]
	}));
	router.get('/auth/google/callback', passport.authenticate('google', {
		successRedirect : '/dashboard',
		failureRedirect : '/usernotfound'
	}));
	
	function isUserExists(userName, password) {
		schema3d.find({
			$or : [ {
				userName : userName
			}, {
				email : userName
			} ],
			password : password
		}, function(err, users) {
			return users.length;
		});
	
	}
	// route that validates login . onsuccess redirects to homepage and onfailure
	// redirects to login screen again
	router.get('/doLogin', passport.authenticate('local', {
		session : true,
		successRedirect : '/dashboard',
		failureRedirect : '/usernotfound',
		failureFlash : true
	}));
	
	/**
	 * ****************AUTHENTICATION IMPLEMENTATION ENDS*********************************
	**/
	
	

//	router.get('/register', function(req, res) {
//	
//		res.render('register_new');
//	});
	
	router.get('/usernotfound', function(req, res) {
	
		req.flash('error', 'It seems You are not registered !! Kindly Register');
		res.redirect('/home');
	});
	
	router.get('/adminnotfound', function(req, res) {
		
		req.flash('error', 'You Are Not Admin !!');
		res.redirect('/');
	});
	
	//router.get('/home',middleWareService.setAdmin,middleWareService.checkReqAdmin, function(req, res) {
	router.get('/home', function(req, res) {
		console.log(req.user);
		console.log(req.admin);
			res.render('default',{
				admin:req.admin,
				expressFlash : req.flash('info'),
				error : req.flash('error')
			});
	});
	
	router.get('/dashboard', middleWareService.checkReqUser, function(req, res) {
	
		// console.log(req.user);
		res.render('user_dashboard', {
			user : req.user,
			expressFlash : req.flash('info'),
			error : req.flash('error')
		});
	});
	
	router.post('/saveUser', middleWareService.checkUserEmailExists,
			middleWareService.checkUserMobileExists, function(req, res) {
	
				// console.log(req.body);
				userModel.persistUserInfo(req.body.firstName, req.body.lastName,
						req.body.password, req.body.email, req.body.mobile);
				req.flash('info', 'You are suceessfully registered.Kindly login.');
				res.redirect('/home');
			});
	
	// logout route.
	router.get('/logout', function(req, res) {
		req.logout();
		req.user = null;
		req.flash('info', 'You have successfully logged out.');
		res.redirect('/home');
	});
	
	router.get('/uploadRequirement', function(req, res) {
	
		res.render('uploadUserRequirement', {
			expressFlash : req.flash('info'),
			error : req.flash('error')
		});
	
	});
	
	router.get('/auth', function(req, res) {
	
		console.log(authConfig.facebookAuth.clientID);
		console.log(authConfig.googleAuth.clientID);
		res.send('done');
	
	});
	
	router.post('/editUser', middleWareService.checkReqUser, function(req, res) {
		// console.log('ajax request comes');
	
		schema3d.user.findOne({
			userEmailId : req.user.userEmailId
		}, function(err, siteUser) {
	
			siteUser.userFirstName = req.body.firstName;
			siteUser.userLastName = req.body.lastName;
	
			siteUser.save(function(err) {
				if (err) {
					res.send({});
				} else {
					req.user.userFirstName = siteUser.userFirstName;
					req.user.userLastName = siteUser.userLastName;
					res.send(siteUser);
				}
			});
		});
	
	});
	
	router.post('/editUserAddress', middleWareService.checkReqUser, function(req,
			res) {
		// console.log('ajax request comes');
	
		schema3d.user.findOne({
			userEmailId : req.user.userEmailId
		}, function(err, siteUser) {
	
			siteUser.userAddress = req.body.address;
			siteUser.save(function(err) {
				if (err) {
					res.send({});
				} else
					req.user.userAddress = siteUser.userAddress;
				res.send(siteUser);
			});
		});
	
	});
	
	router.get('/getOrderHistory', middleWareService.checkReqUser, function(req,
			res) {
		// console.log('ajax request comes');
	
		schema3d.user.findOne({
			userEmailId : req.user.userEmailId
		}, function(err, siteUser) {
	
			if (err) {
				res.send({});
			} else
				res.send(siteUser.UserProductCustom);
	
		});
	
	});
	
	router.post('/uploadProductAndImage/',
					middleWareService.uploadProductImage,
					middleWareService.storeGuest,
					middleWareService.sendConfirmationEmail,
					middleWareService.sendTextSMSToMobile,
					function(req, res) {
	
						req.flash('info','product Details with image successfully uploaded.Your Enquiry Successfully sent.We Will get Back to You soon.');
						if (req.user == undefined) {
							res.redirect('/uploadRequirement');
						} else {
							res.redirect('/dashboard');
						}
	
					});
	
	router.post('/sendContactEmail', middleWareService.sendEmailForContact,
			function(req, res) {
	
				req.flash('info', 'Your Contact request Sent Successfully.');
				res.redirect('/home');
			});
	
	router.get('/insertProduct', function(req, res) {
		res.render('Admin/input');
	});
	
	router.post('/saveProdDetails', middleWareService.uploadOwnProductImage,
			function(req, res) {
				var jsonData = req.body.hdnProd;
				var selectBox = req.body.prodAvailable;
				var prodData = JSON.parse(jsonData);
				userModel.saveProduct(prodData, [ req.files.prodImage.path ]);
				res.redirect('/insertProduct');
	
			});
	
	router.get('/gallery', function(req, res) {
		schema3d.product.find({}, function(err, resultProducts) {
			res.render('galleryView', {
				products : resultProducts
			});
		});
	});
	
	router.get('/productGallery', function(req, res) {
		
			res.render('productGallery');
		
	});
	
	
