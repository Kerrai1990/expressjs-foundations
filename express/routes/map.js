
/*
 * GET map page.
 */

exports.index = function(req, res){
  res.render('map/map', { title: 'Crime Map' });
};