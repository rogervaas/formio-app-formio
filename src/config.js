//var APP_URL = 'http://localhost:6001/formio';
//var API_URL = 'http://localhost:6001/formio';
var APP_URL = 'http://unctad.redfunction.ee/formio';
var API_URL = 'http://unctad.redfunction.ee/formio';

// Parse query string
var query = {};
location.search.substr(1).split("&").forEach(function(item) {
  query[item.split("=")[0]] = item.split("=")[1] && decodeURIComponent(item.split("=")[1]);
});

APP_URL = query.appUrl || APP_URL;
API_URL = query.apiUrl || API_URL;

angular.module('formioApp').constant('AppConfig', {
  appUrl: APP_URL,
  apiUrl: API_URL
});
