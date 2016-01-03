Posts = new Mongo.Collection('posts');

Posts.allow({
	update: function (userId, post) { return ownsDocument(userId, post); },
	remove: function (userId, post) { return ownsDocument(userId, post); }
});

Posts.deny({
	update: function (userId, post, fieldNames) {
		return (_.without(fieldNames, 'url', 'title').length > 0);
	}
});

Meteor.methods({
	postInsert: function(postAttributes) {
		var postWithSameLink = Posts.findOne({url: postAttributes.url});
		if (postWithSameLink) {
			return {
				postExists: true,
				_id: postWithSameLink._id
			}
		}

		var user = Meteor.user();
		var post = _.extend(postAttributes, {
			userId: user._id,
			author: user.username,
			submitted: new Date()
		});

		var postId = Posts.insert(post);
		return {
			_id: postId
		};
	},

	postUpdate: function(postAttributes) {
		var postWithSamLink = Posts.findOne({url: postAttributes.url});
		if (postWithSamLink) {
			return {
				postExists: true,
				_id: postWithSamLink._id
			}
		}

		//alert("postAttributes url: " + postAttributes.url);
		var postId = postAttributes.postId;
		Posts.update(postId, {$set: postAttributes});

		return {
			_id: postId
		};
	}
});