
/*
 * GET reports page.
 */

exports.index = function(req, res){
  res.render('reports/reports', { title: 'Reports' });
};