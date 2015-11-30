define(['models/userModel'], function (User) {
  var UserInfo = function () {
    var user = new User();

    function setUser(data) {
      user.set(data);
    }

    function getUser() {
      return user.toJSON();
    }

    function getType() {
      return user.get('type');
    }

    function isAdmin() {
      return getType() === 'admin';
    }

    return {
      set: setUser,
      get: getUser,
      type: getType,
      isAdmin: isAdmin
    };
  }();
  return UserInfo;
});