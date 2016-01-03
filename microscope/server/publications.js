// Meteor.publish('posts', function(author) {
// 	return Posts.find({author:author});
// });

Meteor.publish('posts', function() {
	return Posts.find({});
});