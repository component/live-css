
/**
 * Module dependencies.
 */

var request = require('superagent')
  , each = require('each')
  , url = require('url');

/**
 * Poll interval.
 */

var interval = 1000;

/**
 * Start live.
 *
 * @api public
 */

exports.start = function(){
  var styles = getStyles();
  each(styles, function(style){
    console.log(style);
  });
};

/**
 * Stop live.
 *
 * @api public
 */

exports.stop = function(){
  
};

/**
 * Return stylesheet links.
 *
 * @return {Array}
 * @api private
 */

function getStyles() {
  var links = document.getElementsByTagName('link');
  var styles = [];

  each(links, function(link){
    if ('stylesheet' != link.getAttribute('rel')) return;
    if (url.isAbsolute(link.getAttribute('href'))) return;
    styles.push(link);
  });

  return styles;
}