define(function() {
  var Api = function() {
    var basePath = 'http://localhost:3000/'; // instance for developers

    function getBasePath() {
      return basePath;
    }

    function get(url, data, options) {
      return request('GET', url, data, options);
    }

    function post(url, data, options) {
      return request('POST', url, data, options);
    }

    function put(url, data, options) {
      return request('PUT', url, data, options);
    }

    function remove(url, data, options) {
      return request('DELETE', url, data, options);
    }

    function request(type, url, data, options) {
      options = options || {};
      var deferredRequest = $.Deferred();

      if (!url) {
        deferredRequest.reject('Url not specified');
        return deferredRequest.promise();
      }

      var requestSettings = getRequestSettings(type, url, data, options);
      sendRequest(requestSettings, deferredRequest);

      return deferredRequest.promise();
    }

    function sendRequest(requestSettings, deferredRequest) {
      $.ajax(requestSettings)
        .done(function(data, statusStr, xhr) {
          deferredRequest.resolve(data, statusStr, xhr);
        })
        .fail(function(xhr) {
          deferredRequest.reject();
        });
    }

    return {
      getBasePath: getBasePath,
      get: get,
      post: post,
      put: put,
      delete: remove
    };
  }();
  return Api;
});