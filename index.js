
/**
 * Module dependencies.
 */

var request = require('superagent')
  , each = require('each')
  , url = require('url');

/**
 * Poll timer.
 */

var timer;

/**
 * Poll interval.
 */

var interval = 1000;

/**
 * Etag map.
 */

var etags = {};

/**
 * Last-Modified map.
 */

var mtimes = {};

/**
 * Start live.
 *
 * @api public
 */

exports.start = function(){
  timer = setTimeout(function(){
    refreshAll();
    exports.start();
  }, interval);
};

/**
 * Stop live.
 *
 * @api public
 */

exports.stop = function(){
  clearTimeout(timer);
};

/**
 * Refresh styles.
 *
 * @api private
 */

function refreshAll() {
  var styles = getStyles();
  each(styles, refresh);
}

/**
 * Refresh `style`.
 *
 * @param {Element} style
 * @api private
 */

function refresh(style) {
  var href = style.getAttribute('href');

  request
  .head(href)
  .end(function(res){
    var etag = res.header.etag;
    if (etag) etags[href] = etag;

    var mtime = res.header['last-modified'];
    if (mtime) mtimes[href] = mtime;
  });
}

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