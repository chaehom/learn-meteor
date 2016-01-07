// Meteor.publish('posts', function(author) {
// 	return Posts.find({author:author});
// });

Meteor.publish('posts', function() {
	return Posts.find({});
});

Meteor.publish('comments', function (postId) {
	return Comments.find({postId: postId});
})

Meteor.publish('notifications', function () {
	return Notifications.find({userId: this.userId, read:false});
})