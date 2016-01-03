Template.postEdit.events({
	'submit form': function (e) {
		e.preventDefault();

		var currentPostId = this._id;

		var postProperties = {
			postId: currentPostId,
			url: $(e.target).find('[name=url]').val(),
			title: $(e.target).find('[name=title]').val()
		}

		// Posts.update(currentPostId, {$set: postProperties}, function(error, result) {
		// 	if (error) {
		// 		alert(error.reason);
		// 	} else {
		// 		Router.go('postPage', {_id: currentPostId});
		// 	}
		// });
		Meteor.call('postUpdate', postProperties, function(error, result) {
			if (error) {
				return alert(error.reaseon);
			}

			if (result.postExists) {
				return alert('This link has already been posted');
			}
			else
			{
				return alert('Update Done!');
			}
		});
	},

	'click .delete': function (e) {
		e.preventDefault();

		if (confirm("Delete this post?")) {
			var currentPostId = this._id;
			Posts.remove(currentPostId);
			Router.go('postsList');
		}
	}
});