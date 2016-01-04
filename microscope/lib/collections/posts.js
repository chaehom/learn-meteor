Posts = new Mongo.Collection('posts');

Posts.allow({
	update: function (userId, post) { return ownsDocument(userId, post); },
	remove: function (userId, post) { return ownsDocument(userId, post); }
});

Posts.deny({
	//unavailable callback
	update: function (userId, post, fieldNames, modifier) {
		// return (_.without(fieldNames, 'url', 'title').length > 0);
		var errors = validatePost(modifier.$set);
		return errors.title || errors.url;
	}
});

Meteor.methods({
	postInsert: function(postAttributes) {
		var errors = validatePost(postAttributes);
		if (errors.title || errors.url) {
			throw new Meteor.Error('invalid-post', "你必须为你的帖子填写标题和url");
		}

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
		var errors = validatePost(postAttributes);
		if (errors.title || errors.url) {
			throw new Meteor.Error('invalid-post', "你必须为你的帖子填写标题和url");
		}

		var postWithSamLink = Posts.findOne({url: postAttributes.url});
		if (postWithSamLink) {
			return {
				postExists: true,
				_id: postWithSamLink._id
			}
		}

		//alert("postAttributes url: " + postAttributes.url);
		var postId = postAttributes.postId;
		Posts.update(postId, {$set: postAttributes}, function(error){});

		return {
			_id: postId
		};
	}
});

validatePost = function (post) {
	var errors = {};

	if (!post.title) {
		errors.title = '请填写标题';
	}

	if (!post.url) {
		errors.url = '请填写url';
	}

	return errors;
}