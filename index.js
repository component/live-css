
/**
 * Module dependencies.
 */

var url = require('url');

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
  console.log(styles());
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

function styles() {
  var links = document.getElementsByTagName('link');
  var styles = [];

  for (var i = 0; i < links.length; i++) {
    if ('stylesheet' != links[i].getAttribute('rel')) continue;
    if (url.isAbsolute(links[i].getAttribute('href'))) continue;
    styles.push(links[i]);
  }

  return styles;
}