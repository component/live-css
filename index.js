
/**
 * Module dependencies.
 */

var request = require('superagent')
  , debug = require('debug')('live-css')
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
    checkAll();
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
 * Check styles.
 *
 * @api private
 */

function checkAll() {
  var styles = getStyles();
  each(styles, check);
}

/**
 * Check `style`.
 *
 * @param {Element} style
 * @api private
 */

function check(style) {
  var href = style.getAttribute('href');
  var prevEtag = etags[href];
  var prevMtime = mtimes[href];

  request
  .head(href)
  .end(function(res){
    var etag = res.header.etag;
    if (etag) etags[href] = etag;

    var mtime = res.header['last-modified'];
    if (mtime) mtimes[href] = mtime;

    if (etag && etag != prevEtag) {
      debug('etag mismatch');
      debug('old "%s"', prevEtag);
      debug('new "%s"', etag);
      debug('changed %s', href);
      return refresh(style);
    }

    if (mtime && mtime != prevMtime) {
      debug('mtime mismatch');
      debug('old "%s"', prevMtime);
      debug('new "%s"', mtime);
      debug('changed %s', href);
      return refresh(style);
    }
  });
}

/**
 * Refresh `style`.
 *
 * @param {Element} style
 * @api private
 */

function refresh(style) {
  var parent = style.parentNode;
  var sibling = style.nextSibling;
  var clone = style.cloneNode(true);

  // insert
  if (sibling) {
    parent.insertBefore(clone, sibling);
  } else {
    parent.appendChild(clone);
  }

  // remove prev
  parent.removeChild(style);
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