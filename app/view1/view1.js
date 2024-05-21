'use strict';
angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
      });
    }])

    .controller('View1Ctrl', ['$scope', '$http', function($scope, $http) {
      $scope.photos = [];
      $scope.loading = false;
      $scope.currentPage = 1;
      $scope.perPageSize = '6';
      $scope.totalPages = 1;
      $scope.color = '';

      $scope.loadPhotos = function () {
        if ($scope.searchInput) {
          let apiUrl = 'https://api.unsplash.com/search/photos';
          $http.get(apiUrl, {
            params: {
              client_id: 'mc022uV3PnBEenyHqnvPyCbvybr9q1FohSeLtqly80Q',
              query: $scope.searchInput,
              page: $scope.currentPage,
              per_page: parseInt($scope.perPageSize),
              color: $scope.color || null,
            }
          }).then(function (response) {
            const newPhotos = response.data.results.map(function(item) {
              return {
                url: item.urls.regular,
                alt: item.description
              };
            });
            $scope.photos = $scope.photos.concat(newPhotos);
            $scope.totalPages = response.data.total_pages;
            $scope.loading = false;
          }, function (error) {
            console.error('Error fetching photos:', error);
            $scope.loading = false;
          });
        }
      };

      $scope.searchClick = function () {
        $scope.photos = [];
        $scope.currentPage = 1;
        $scope.loadPhotos();
      };

      $scope.enterPress = function(event) {
        if (event.which === 13) { // Enter
          $scope.searchClick();
        }
      };

      $scope.previousPage = function() {
        if ($scope.currentPage > 1) {
          $scope.currentPage--;
        }
      };

      $scope.nextPage = function() {
        if ($scope.currentPage < $scope.totalPages) {
          const currentLen = $scope.photos.length;
          $scope.currentPage++;
          if (currentLen < $scope.currentPage * $scope.perPageSize) {
            $scope.loadPhotos();
          }
        }
      };
    }]);
