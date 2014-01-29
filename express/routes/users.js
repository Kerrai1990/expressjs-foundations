
/*
 * GET users page.
 */

exports.index = function(req, res){
  res.render('users/users', { title: 'Users' });
};

/*  */