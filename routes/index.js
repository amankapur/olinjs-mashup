var ether = require('./ether');
var models = require('./models');

exports.index = function(req, res){

	req.facebook.api('/me', function(err, data) {
  	if (err) return console.log('error', err);
  	console.log(data);
  	//console.log(req.session.user);
	  if (typeof (req.session.user) == "undefined"){
	  	models.User.findOne({username : data.username},function(err, user) {
				if (err) return console.log('error', err);
				if (user) {
					req.session.user = user;
					console.log(user.username);
					console.log('ALREADY A USER');
					res.redirect('/');
				}
				else {
					
					ether.etherpad.createGroup(function(err, groupData){
						if (err) return console.log('error', err);
						data.groupID = groupData.groupID;
					 	var newUser = new models.User(data);
				  	newUser.save(function(err){
							console.log('saving user');
							//if(err) return console.log("error", err);
							req.session.user = newUser;
							res.redirect('/');
						});
					});
					 
			  }
			});
			
		}

		else {
			models.User.findOne({username : req.session.user.username}).exec(function(err, doc){
				req.facebook.api('/me/friends', function(err, allfriends){
					if (err) return console.log(err);
					//console.log(doc);
					res.render('main', {title: doc.name, user: doc, allfriends: JSON.stringify(allfriends.data), padName:'none'});
				});
				
			});
		}
	});

};

exports.newPad = function(req, res){
	var pdname = randomString(16);
	var args = {groupID: req.session.user.groupID, padName: pdname, text: "test"};
	var friendIDs = req.body.inputFriendsIDs;

	//get facebook emails using IDs
	console.log(friendIDs);
	for(i = 0; i< friendIDs.length; i++){
		req.facebook.api('/' + friendIDs[i], function(err, friendData){
			if (err) return console.log(err);
				res.sendEmail('email', {
					to: friendData.username + '@facebook.com',
					subject: 'OLIN MASHUP!!!!',
					code: pdname
				}, function(err, data){
					if(err) return console.log("ERROR", err);
					console.log('email sent')
					console.log(data);
				});
		});
	}
	//console.log(pdname);
	// TEST MAILER, WORKS LIKE A BAWSS!!!!
	// res.sendEmail('email', {
	// 	to: 'amankapur91@gmail.com',
	// 	subject: 'OLIN MASHUP!!!!',
	// 	code: "TEST CODE"
	// }, function(err, data){
	// 	if(err) return console.log("ERROR", err);
	// 	console.log(data);
	// });

	ether.etherpad.createGroupPad(args, function(err, data){
		
		if(err) return console.log('ERROR CREATING PAD: ', err);
		console.log(req.session.user);
			var newPad = models.Pad({padID: pdname, authors:[req.session.user.id]});
			newPad.save(function(err, data){
				if(err) return console.log('ERROR SAVING PAD ', err);
				res.render('_etherpad', {padName: pdname});
			});
	});
};

exports.joinPad = function(req, res){
	var padID = req.body.padID;
	console.log('join Pad request');
	console.log(padID);
	models.Pad.findOne({padID: padID}).exec(function(err, data){
		if (err) return console.log('ERROR RETREIVING PAD: ', err, padID);
			var authors = data.authors;
			if (authors.indexOf(req.session.user.id) < 0) {
				data.authors.push(req.session.user.id);
				data.save();
			} 
		res.render('_etherpad', {padName: padID});
	});
	
};

exports.postFB = function(req, res){

	var padID = req.body.padID;

	console.log(padID);
	models.Pad.findOne({padID: padID}).exec(function(err, padData){
		if (err) return console.log('ERROR RETREIVING PAD: ', err, padID);
		var authors = padData.authors;
		// console.log("PAD DATA!!!");
		// console.log(padData);

		ether.etherpad.getText({padID: padID}, function(err, data){
			if (err) return console.log('ERROR GETTING TEXT', err);
			//console.log(data);
			var message = data.text;
			console.log(message);
		  for (i = 0; i < authors.length; i++){
		 	 req.facebook.api('/'+authors[i] + '/feed', 'POST', {message: message}, function(err, data){
		 	 	if(err) return console.log('ERROR POSTING to FACEBOOK', err);
		 	 	res.send("success");
		 	 })
		  }
		});

		// req.facebook.api('/' + req.session.user.id + '/feed', 'POST', {message: "test post from OlinJs-mashup"}, function(err, data){
		// 		if (err) return console.log('ERROR POSTING TO FACEBOOK', err);
		// 		console.log(data);
		// });
	});

};

function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
    	var randomPoz = Math.floor(Math.random() * charSet.length);
    	randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}










