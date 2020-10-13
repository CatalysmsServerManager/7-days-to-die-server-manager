/**
 * Module dependencies
 */

let path = require('path');
let fs = require('fs');
let _ = require('@sailshq/lodash');
let ejs = require('ejs');

let exists = fs.existsSync || path.existsSync;
let resolve = path.resolve;
let extname = path.extname;
let dirname = path.dirname;
let join = path.join;
let basename = path.basename;


/**
 * Fork of https://github.com/balderdashy/sails/blob/master/lib/hooks/views/default-view-rendering-fn.js
 *
 * Mostly just changing it to newer ejs that handles async
 *
 * Implement EJS layouts and partials (a la Express 2).
 *
 * This is a slightly modified (for EJS >= 2.3.4) version of the defunct ejs-locals package:
 * ------------------------------------------------------------------------------------------
 * https://github.com/randometc/ejs-locals
 * (The MIT License)
 *
 * Copyright (c) 2012 Robert Sköld <robert@publicclass.se> Copyright (c) 2012 Tom Carden <tom@tom-carden.co.uk>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * ------------------------------------------------------------------------------------------
 * For further explanation, see:
 *  => http://sailsjs.com/documentation/concepts/views/layouts#?why-do-layouts-only-work-for-ejs
 */

module.exports = async function renderFile(file, options, fn){
  console.log({ file });
  // Express used to set options.locals for us, but now we do it ourselves
  // (EJS does some __proto__ magic to expose these funcs/values in the template)
  if (!options.locals) {
    options.locals = {};
  }

  // Make sure the absolute path to view is always available.
  // (needed for partials)
  options.filename = file;

  if (!options.locals.blocks) {
    // one set of blocks no matter how often we recurse
    let blocks = { scripts: new Block(), stylesheets: new Block() };
    options.locals.blocks = blocks;
    options.locals.scripts = blocks.scripts;
    options.locals.stylesheets = blocks.stylesheets;
    options.locals.block = block.bind(blocks);
    options.locals.stylesheet = stylesheet.bind(blocks.stylesheets);
    options.locals.script = script.bind(blocks.scripts);
  }
  // override locals for layout/partial bound to current options
  options.locals.layout  = layout.bind(options);
  options.locals.partial = partial.bind(options);

  options.locals.serverMapUrl = async (serverId) => {
    const server = await SdtdServer.findOne(serverId);
    return `http://${server.ip}:${server.webPort}/map/{z}/{x}/{y}.png?adminuser=${sdtdServer.authName}&admintoken=${sdtdServer.authToken}`;
  };

  options.async = true;

  try {
    let html = await ejs.renderFile(file, _.extend(options, options.locals), options);

    let layout = options.locals.layoutTemplate;
    if (layout === undefined || layout === true) {
      layout = sails.config.views.layoutTemplate;
    }
    if (layout) {
      layout = join(options.settings.views, layout) + '.' + sails.config.views.extension;

      // clear to make sure we don't recurse forever (layouts can be nested)
      options.locals.layoutTemplate = false;
      options.layoutTemplate = false;
      // make sure caching works inside ejs.renderFile/render
      delete options.filename;

      // now recurse and use the current result as `body` in the layout:
      options.locals.body = html;

      html = await renderFile(layout, options);
    }

    // no layout, just do the default:
    if (fn) {
      fn(null, html);
    } else {
      return html;
    }
  } catch (err) {
    if (fn) {
      return fn(err,null);
    }
    throw err;
  }
};

/**
 * Memory cache for resolved object names.
 */

let cache = {};

/**
 * Resolve partial object name from the view path.
 * (Or, for performance, use the cached version if available.)
 *
 * Examples:
 *
 *   "user.ejs" becomes "user"
 *   "forum thread.ejs" becomes "forumThread"
 *   "forum/thread/post.ejs" becomes "post"
 *   "blog-post.ejs" becomes "blogPost"
 *
 * @return {String}
 * @api private
 */

function resolveObjectName(view){
  if (cache[view]) { return cache[view]; }

  cache[view] =
  view.split('/')
    .slice(-1)[0]
    .split('.')[0]
    .replace(/^_/, '')
    .replace(/[^a-zA-Z0-9 ]+/g, ' ')
    .split(/ +/).map(function(word, i){
      return i ? word[0].toUpperCase() + word.substr(1) : word;
    }).join('');

  return cache[view];
}

/**
 * Lookup partial path from base path of current template:
 *
 *   - partial `_<name>`
 *   - any `<name>/index`
 *   - non-layout `../<name>/index`
 *   - any `<root>/<name>`
 *   - partial `<root>/_<name>`
 *
 * Options:
 *
 *   - `cache` store the resolved path for the view, to avoid disk I/O
 *
 * @param {String} root, full base path of calling template
 * @param {String} partial, name of the partial to lookup (can be a relative path)
 * @param {Object} options, for `options.cache` behavior
 * @return {String}
 * @api private
 */

function lookup(root, partial, options){

  let engine = options.settings['view engine'] || 'ejs';
  let desiredExt = '.' + engine;
  let ext = extname(partial) || desiredExt;
  let key = [ root, partial, ext ].join('-');

  if (options.cache && cache[key]) { return cache[key]; }

  // Make sure we use dirname in case of relative partials
  // ex: for partial('../user') look for /path/to/root/../user.ejs
  let dir = dirname(partial);
  let base = basename(partial, ext);

  // _ prefix takes precedence over the direct path
  // ex: for partial('user') look for /root/_user.ejs
  partial = resolve(root, dir,'_'+base+ext);
  if( exists(partial) ) {
    if (options.cache) { cache[key] = partial; }
    return partial;
  }

  // Try the direct path
  // ex: for partial('user') look for /root/user.ejs
  partial = resolve(root, dir, base+ext);
  if( exists(partial) ) {
    if (options.cache) { cache[key] = partial; }
    return partial;
  }

  // Try index
  // ex: for partial('user') look for /root/user/index.ejs
  partial = resolve(root, dir, base, 'index'+ext);
  if( exists(partial) ) {
    if (options.cache) { cache[key] = partial; }
    return partial;
  }

  // FIXME:
  // * there are other path types that Express 2.0 used to support but
  //   the structure of the lookup involved View class methods that we
  //   don't have access to any more
  // * we probaly need to pass the Express app's views folder path into
  //   this function if we want to support finding partials relative to
  //   it as well as relative to the current view
  // * we have no tests for finding partials that aren't relative to
  //   the calling view

  return null;
}


/**
 * Render `view` partial with the given `options`. Optionally a
 * callback `fn(err, str)` may be passed instead of writing to
 * the socket.
 *
 * Options:
 *
 *   - `object` Single object with name derived from the view (unless `as` is present)
 *
 *   - `as` Variable name for each `collection` value, defaults to the view name.
 *     * as: 'something' will add the `something` local variable
 *     * as: this will use the collection value as the template context
 *     * as: global will merge the collection value's properties with `locals`
 *
 *   - `collection` Array of objects, the name is derived from the view name itself.
 *     For example _video.html_ will have a object _video_ available to it.
 *
 * @param  {String} view
 * @param  {Object|Array} options, collection or object
 * @return {String}
 * @api private
 */

function partial(view, options){

  let collection;
  let object;
  let locals;
  let name;

  // parse options
  if( options ){
    // collection
    if( options.collection ){
      collection = options.collection;
      delete options.collection;
    } else if( 'length' in options ){
      collection = options;
      options = {};
    }

    // locals
    if( options.locals ){
      locals = options.locals;
      delete options.locals;
    }

    // object
    if( 'Object' !== options.constructor.name ){
      object = options;
      options = {};
    } else if( options.object !== undefined ){
      object = options.object;
      delete options.object;
    }
  } else {
    options = {};
  }

  // merge locals into options
  if( locals ) {
    options.__proto__ = locals;
  }

  // merge app locals into options
  for(let k in this) {
    options[k] = options[k] || this[k];
  }

  // extract object name from view
  name = options.as || resolveObjectName(view);

  // find view, relative to this filename
  // NOTE -- the original `dirname(options.filename)` stopped working
  // after ejs-locals was inlined, perhaps due to changed in EJS.
  // The `options.absPathToView` value is set above in the
  // main `renderFile` function. -SMG 10/27/2016
  let root = dirname(options.filename);
  let file = lookup(root, view, options);
  let key = file + ':string';
  if( !file ) {
    throw new Error('Could not find partial ' + view);
  }

  // read view
  let source = options.cache
    ? cache[key] || (cache[key] = fs.readFileSync(file, 'utf8'))
    : fs.readFileSync(file, 'utf8');

  // Update the options.filename to point to the current partial,
  // so that relative paths can work in calling nested partials.
  // -SMG 10/27/2016
  options.filename = file;

  // re-bind partial for relative partial paths
  options.partial = partial.bind(options);

  // render partial
  function render(){
    if (object) {
      if ('string' === typeof name) {
        options[name] = object;
      } else if (name === global) {
        // wtf?
        // merge(options, object);
      }
    }
    // TODO Support other templates (but it's sync now...)
    let html = ejs.render(source, options, options);
    return html;
  }

  // Collection support
  if (collection) {
    let len = collection.length;
    let buf = '';
    let keys;
    let prop;
    let val;
    let i;

    if ('number' === typeof len || Array.isArray(collection)) {
      options.collectionLength = len;
      for (i = 0; i < len; ++i) {
        val = collection[i];
        options.firstInCollection = i === 0;
        options.indexInCollection = i;
        options.lastInCollection = i === len - 1;
        object = val;
        buf += render();
      }
    } else {
      keys = Object.keys(collection);
      len = keys.length;
      options.collectionLength = len;
      options.collectionKeys = keys;
      for (i = 0; i < len; ++i) {
        prop = keys[i];
        val = collection[prop];
        options.keyInCollection = prop;
        options.firstInCollection = i === 0;
        options.indexInCollection = i;
        options.lastInCollection = i === len - 1;
        object = val;
        buf += render();
      }
    }

    return buf;
  } else {
    return render();
  }
}

/**
 * Apply the given `view` as the layout for the current template,
 * using the current options/locals. The current template will be
 * supplied to the given `view` as `body`, along with any `blocks`
 * added by child templates.
 *
 * `options` are bound  to `this` in renderFile, you just call
 * `layout('myview')`
 *
 * @param  {String} view
 * @api private
 */
function layout(view){
  this.locals.layoutTemplate = view;
}

function Block() {
  this.html = [];
}

Block.prototype = {
  toString: function() {
    return this.html.join('\n');
  },
  append: function(more) {
    this.html.push(more);
  },
  prepend: function(more) {
    this.html.unshift(more);
  },
  replace: function(instead) {
    this.html = [ instead ];
  }
};

/**
 * Return the block with the given name, create it if necessary.
 * Optionally append the given html to the block.
 *
 * The returned Block can append, prepend or replace the block,
 * as well as render it when included in a parent template.
 *
 * @param  {String} name
 * @param  {String} html
 * @return {Block}
 * @api private
 */
function block(name, html) {
  // bound to the blocks object in renderFile
  let blk = this[name];
  if (!blk) {
    // always create, so if we request a
    // non-existent block we'll get a new one
    blk = this[name] = new Block();
  }
  if (html) {
    blk.append(html);
  }
  return blk;
}

// bound to scripts Block in renderFile
function script(path, type) {
  if (path) {
    this.append('<script src="'+path+'"'+(type ? 'type="'+type+'"' : '')+'></script>');
  }
  return this;
}

// bound to stylesheets Block in renderFile
function stylesheet(path, media) {
  if (path) {
    this.append('<link rel="stylesheet" href="'+path+'"'+(media ? 'media="'+media+'"' : '')+' />');
  }
  return this;
}

