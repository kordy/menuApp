define(['router'], function (Router) {
  var Api = function () {
    var basePath = '/api/';

    function getBasePath() {
      return basePath;
    }

    function get(url, data) {
      return request('GET', url, data);
    }

    function post(url, data) {
      return request('POST', url, data);
    }

    function put(url, data) {
      return request('PUT', url, data);
    }

    function remove(url, data) {
      return request('DELETE', url, data);
    }

    function request(type, url, data) {
      var deferredRequest = $.Deferred();

      if (!url) {
        deferredRequest.reject('Url not specified');
        return deferredRequest.promise();
      }

      var options = {

        url: getBasePath() + url,
        type: type,
        data: data
      };

      sendRequest(options, deferredRequest);
      return deferredRequest.promise();
    }

    function sendRequest(requestSettings, deferredRequest) {
      $.ajax(requestSettings)
        .done(function (data, statusStr, xhr) {
          deferredRequest.resolve(data, statusStr, xhr);
        })
        .fail(function (xhr) {
          if (xhr && xhr.responseJSON && xhr.responseJSON.tokenFail) {
            Router.go('login');
          }
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