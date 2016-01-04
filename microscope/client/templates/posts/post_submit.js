Template.postSubmit.events({
	'submit form': function(e) {
		e.preventDefault();

		var post = {
			url: $(e.target).find('[name=url]').val(),
			title: $(e.target).find('[name=title]').val()
		};

		var errors = validatePost(post);
		if (errors.title || errors.url) {
			return Session.set('postSubmitErrors', errors);
		}

		// post._id = Posts.insert(post);
		// Router.go('postPage', post);
		Meteor.call('postInsert', post, function(error, result) {
			if (error) {
				return alert(error.reaseon);
			}

			if (result.postExists) {
				//alert('This link has already been posted');
				throwError('This link has already been posted');
			}
		});

		Router.go('postsList', {_id: result._id});
	}
});

Template.postSubmit.onCreated(function () {
	Session.set('postSubmitErrors', {});
});

Template.postSubmit.helpers({
	errorMessage: function(field) {
		return Session.get('postSubmitErrors')[field];
	},
	errorClass: function (field) {
		return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
	}
});