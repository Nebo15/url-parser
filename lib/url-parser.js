(function () {
  'use strict';

  function URLParams(paramsString) {
    if (typeof paramsString === 'string') {
      this.params = this.parse(paramsString);
    } else if (typeof paramsString === 'object') {
      this.params = paramsString;
    } else {
      console.log('unsupported params string. please pass only object of params or string');
      this.params = null;
    }
  }

  URLParams.prototype.parse = (function () {
    var re = /([^&=]+)=?([^&]*)/g;
    var decode = function (str) {
      return decodeURIComponent(str.replace(/\+/g, ' '));
    };
    return function (query) {
      // recursive function to construct the result object
      function createElement(params, key, value) {
        key = key + '';
        var list;
        // if the key is a property
        if (key.indexOf('.') !== -1) {
          // extract the first part with the name of the object
          list = key.split('.');
          // the rest of the key
          var new_key = key.split(/\.(.+)?/)[1];
          // create the object if it doesnt exist
          if (!params[list[0]]) params[list[0]] = {};
          // if the key is not empty, create it in the object
          if (new_key !== '') {
            createElement(params[list[0]], new_key, value);
          } else console.warn('parseParams :: empty property in key "' + key + '"');
        } else
        // if the key is an array
        if (key.indexOf('[') !== -1) {
          // extract the array name
          list = key.split('[');
          key = list[0];
          // extract the index of the array
          list = list[1].split(']');
          var index = list[0];
          // if index is empty, just push the value at the end of the array
          if (index == '') {
            if (!params) params = {};
            if (!params[key] || !Array.isArray(params[key])) params[key] = [];
            params[key].push(value);
          } else
          // add the value at the index (must be an integer)
          {
            if (!params) params = {};
            if (!params[key] || !Array.isArray(params[key])) params[key] = [];
            params[key][parseInt(index)] = value;
          }
        } else
        // just normal key
        {
          if (!params) params = {};
          params[key] = value;
        }
      }

      // be sure the query is a string
      query = query + '';
      if (query === '') query = window.location + '';
      var params = {}, e;
      if (query) {
        // remove # from end of query
        if (query.indexOf('#') !== -1) {
          query = query.substr(0, query.indexOf('#'));
        }

        // remove ? at the begining of the query
        if (query.indexOf('?') !== -1) {
          query = query.substr(query.indexOf('?') + 1, query.length);
        } else return {};
        // empty parameters
        if (query == '') return {};
        // execute a createElement on every key and value
        while (e = re.exec(query)) {
          var key = decode(e[1]);
          var value = decode(e[2]);
          createElement(params, key, value);
        }
      }
      return params;
    };
  })();

  URLParams.prototype.serialize = function (object) {

    // recursive function to construct the result string
    function createString(element, nest) {
      if (element === null) return '';

      var count = 0, url = '';
      if (Array.isArray(element)) {
        for (var t = 0; t < element.length; t++) {
          if (count > 0) url += '&';
          url += encodeURIComponent(nest) + '[]=' + encodeURIComponent(element[t]);
          count++;
        }
        return url;
      } else if (typeof element === 'object') {
        for (var name in element) {
          if (element.hasOwnProperty(name)) {
            if (count > 0) url += '&';
            url += createString(element[name], nest + '.' + name);
            count++;
          }
        }
        return url;
      } else {
        return encodeURIComponent(nest) + '=' + encodeURIComponent(element);
      }
    }

    var url = '?',
      count = 0;

    // execute a createString on every property of object
    for (var name in object) {
      if (object.hasOwnProperty(name)) {
        if (count > 0) url += '&';
        url += createString(object[name], name);
        count++;
      }
    }

    return url;
  };

  URLParams.prototype.toString = function () {
    return this.serialize(this.params);
  };
  URLParams.prototype.toJSON = function () {
    return this.params;
  };

  function URLParser(string) {
    if (!string) {
      return console.log('Undefined string for URL parser');
    }

    this.params = {};
    this.href = string;
    this.protocol = null;
    this.hostname = null;
    this.port = null;
    this.pathname = null;
    this.search = null;
    this.hash = null;

    this.parse(string);
  }

  URLParser.prototype.parse = function (string) {
    // specify parsing for several platforms
    if (document && document.createElement) {
      var link = document.createElement('a');
      link.href = string;

      this.href = link.href;
      this.protocol = link.protocol;
      this.hostname = link.hostname;
      this.port = link.port;
      this.pathname = link.pathname;
      this.host = link.host;
      this.hash = link.hash;

      this._params = new URLParams(link.search);
      this.params = this._params.params;

    } else {
      console.warn('Unsupported platform');
    }
  };
  URLParser.prototype.toString = function () {
    return [
      this.protocol ? (this.protocol + '//') : '',
      this.hostname,
      this.port ? (':' + this.port) : '',
      this.pathname,
      this._params.toString(),
      this.hash
    ].join('');
  };
  URLParser.prototype.toJSON = function () {
    return {
      href: this.href,
      protocol: this.protocol,
      hostname: this.hostname,
      port: this.port,
      pathname: this.pathname,
      host: this.host,
      hash: this.hash,
      params: this.params
    };
  };

  if (typeof window !== 'undefined') {
    window.URLParser = URLParser;
    window.URLParams = URLParams;

    // Angular JS module

    if (window.angular) {
      angular.module('url-parser', []).factory('URLParser', function () {
        return URLParser;
      });
    }
  }

})();
