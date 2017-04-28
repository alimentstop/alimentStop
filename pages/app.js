'use strict';

var www = angular.module('www', ['async', 'ui.router']);
www.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}]);
(function() {
  www.run(['$rootScope', '$http', 'async', '$q', startApp]);

  function startApp($rootScope, $http, async, $q) {
    $rootScope.appDefer = $q.defer();
    $rootScope.appPromise = $rootScope.appDefer.promise;
    $rootScope.site = {};
    $rootScope.appLoading = true;
    $rootScope.appLoaded = false;
    $rootScope.menuLoaded = false;
    $rootScope.isSaveDisabled = true;
    $rootScope.price = null;
    $rootScope.isSaveDisabled = false;
    //console.log(document.getElementById("main").style.visibility = 'visible');
    $rootScope.fields = {
      seatNo: null
    };
    async.series([
        _getBuses
      ],
      function(err) {
        if (err) {
          return horn.error(err);
          $rootScope.appLoading = false;
        }
        $rootScope.appLoading = false;
        $rootScope.appLoaded = true;
        $rootScope.appDefer.resolve();
      }
    );

    function _getBuses(next) {
      $http.get('/api/buses').then(function(res) {
        $rootScope.buses = res.data;
        if (next)
          return next();
        else
          return;
      });
    }

    $rootScope.selectBus = function(bus) {
      $rootScope.currentBus = bus;
      $http.get('/api/menuItems/' + bus.hotelId + '?isActive=true').then(function(res) {
        $rootScope.menu = _.groupBy(res.data, 'group');
        $rootScope.originalMenu = res.data;
        console.log("menu", $rootScope.menu);
        $rootScope.menuLoaded = true;
        return;
      });
    }

    $rootScope.selectSeat = function() {
      $rootScope.orderLoaded = false;
      $rootScope.loadingOrders = true;
      if (!$rootScope.fields.seatNo) {
        return;
      }
      $http.get('/api/orders/' + $rootScope.fields.seatNo).then(function(res) {
        console.log("orders", res.data);
        $rootScope.orders = res.data;
        $rootScope.orders.length !== 0 ? $rootScope.isSaveDisabled = true : $rootScope.isSaveDisabled = false;
        _.each($rootScope.originalMenu,
          function(menuItem) {
            if (_.findWhere($rootScope.orders, {
                menuItemId: menuItem.id
              }))
              menuItem.quantity = _.findWhere($rootScope.orders, {
                menuItemId: menuItem.id
              }).quantity;
            else
              menuItem.quantity = null;
          }
        );
        getPrice();
        $rootScope.loadingOrders = false;
        $rootScope.orderLoaded = true;
        return;
      });
    }

    $rootScope.addItem = function(item) {
      if (!item.quantity) {
        item.quantity = 1;
      } else {
        item.quantity++;
      }
      getPrice();
    }

    $rootScope.removeItem = function(item) {
      if (!item.quantity)
        return;
      else
        item.quantity--;
      getPrice();
    }

    $rootScope.saveOrder = function() {
      var orders = [];
      _.each($rootScope.originalMenu,
        function(item) {
          if (item.quantity)
            orders.push({
              busId: $rootScope.currentBus.id,
              seatNo: $rootScope.fields.seatNo,
              menuItemId: item.id,
              quantity: item.quantity
            })
        }
      );
      console.log("saving", orders);
      $http({
        method: 'POST',
        url: '/api/orders/',
        data: orders
      }).then(
        function() {
          $rootScope.selectSeat();
        }
      );
    }

    function getPrice() {
      $rootScope.price = 0;
      _.each($rootScope.originalMenu,
        function(menuItem) {
          $rootScope.price += menuItem.price * menuItem.quantity;
        }
      );
    }
  }
})();

(function() {
  'use strict';

  www.controller('ordersByBusCtrl', ['$scope', '$http', 'async', ordersByBusCtrl]);

  function ordersByBusCtrl($scope, $http, async) {
    $scope.appPromise.then(init);
    $scope.ordersLoaded = false;
    $scope.loadingOrders = false;

    function init() {
      document.getElementById("main").style.visibility = 'visible';
      async.series([],
        function(err) {
          if (err) {
            return horn.error(err);
          }
        }
      );
    }

    function _getOrdersByBusId(next) {
      console.log("buses", $scope.buses);
      $http.get('/api/ordersByBusId/' + $scope.currentBus.id).then(function(res) {
        $scope.orders = res.data;
        console.log("orders", $scope.orders);
        return next();
      });
    }

    function _getMenuItemsByHotelId(next) {
      $http.get('/api/menuItems/' + $scope.currentBus.hotelId).then(function(res) {
        $scope.menu = res.data;
        console.log("menu", $scope.menu);
        return next();
      });
    }

    $scope.selectBus = function(bus) {
      $scope.ordersLoaded = false;
      $scope.loadingOrders = true;
      $scope.currentBus = bus;
      async.series([
          _getMenuItemsByHotelId,
          _getOrdersByBusId
        ],
        function(err) {
          if (err) {
            return horn.error(err);
          }
          _.each($scope.orders,
            function(order) {
              var menuItem = _.findWhere($scope.menu, {
                id: order.menuItemId
              })
              order.menuItemName = menuItem.name;
              order.totalPrice = menuItem.price * order.quantity;
              order.price = menuItem.price;
            }
          );
          var ordersByMenuItem = _.groupBy($scope.orders, 'menuItemId');
          _.each(ordersByMenuItem,
            function(orders, menuItemId) {
              var totalQuantity = 0;
              _.each(orders,
                function(order) {
                  totalQuantity += order.quantity;
                }
              );
              _.findWhere($scope.menu, {
                id: parseInt(menuItemId)
              }).quantity = totalQuantity;
            }
          );
          var ordersBySeat = _.groupBy($scope.orders, 'seatNo');
          $scope.ordersBySeat = [];
          _.each(ordersBySeat,
            function(orders, seatNo) {
              var totalPrice = 0;
              _.each(orders,
                function(order) {
                  totalPrice += order.totalPrice;
                }
              );
              $scope.ordersBySeat.push({
                seatNo: seatNo,
                orders: orders,
                totalPrice: totalPrice
              });
            }
          );
          $scope.totalItemsOrdered = 0;
          _.each($scope.orders,
            function(order) {
              $scope.totalItemsOrdered += order.quantity;
            }
          );
          $scope.TotalOrderWorth = 0;
          _.each($scope.ordersBySeat,
            function(order) {
              $scope.TotalOrderWorth += order.totalPrice;
            }
          );
          $scope.loadingOrders = false;
          $scope.ordersLoaded = true;
        }
      );
    }
  }
}());

(function() {
  'use strict';

  www.controller('adminCtrl', ['$scope', '$rootScope', '$http', 'async', adminCtrl]);

  function adminCtrl($scope, $rootScope, $http, async) {
    $scope.appPromise.then(init);
    $scope.ordersLoaded = false;
    $scope.loadingOrders = false;
    $scope.newBus = {};
    $scope.newMenuItem = {};
    $scope.newHotel = {};
    $scope.selectedHotel = null;

    function init() {
      document.getElementById("main").style.visibility = 'visible';
      async.series([
          _getHotels
        ],
        function(err) {
          if (err) {
            return horn.error(err);
          }
        }
      );
    }

    function _getMenuItemsByHotelId(next) {
      $http.get('/api/menuItems/' + $scope.currentBus.hotelId + '?isActive=true').then(function(res) {
        $scope.menu = res.data;
        console.log("menu", $scope.menu);
        if (next)
          return next();
        else
          return;
      });
    }

    function _getHotels(next) {
      $http.get('/api/hotels/').then(function(res) {
        $scope.hotels = res.data;
        console.log("hotels", $scope.hotels);
        if (next)
          return next();
        else
          return;
      });
    }


    function _getCurrentBusById(next) {
      $http.get('/api/buses/' + $scope.currentBus.id).then(function(res) {
        $scope.currentBus = res.data;
        $scope.selectedHotel = _.findWhere($scope.hotels, {
          id: $scope.currentBus.hotelId
        });
        $scope.currentBus.hotelName = $scope.selectedHotel.name;
        if (next)
          return next();
        else
          return;
      });
    }

    $scope.selectHotel = function(hotel) {
      $scope.selectedHotel = hotel;
    }

    $scope.selectBus = function(bus) {
      $scope.ordersLoaded = false;
      $scope.loadingOrders = true;
      $scope.currentBus = bus;
      $scope.currentBus.hotelName = _.findWhere($scope.hotels, {
        id: $scope.currentBus.hotelId
      }).name;
      async.series([
          _getMenuItemsByHotelId
        ],
        function(err) {
          if (err) {
            return horn.error(err);
          }
          $scope.selectedHotel = _.findWhere($scope.hotels, {
            id: $scope.currentBus.hotelId
          });
          $scope.loadingOrders = false;
          $scope.ordersLoaded = true;
        }
      );
    }

    $scope.createBus = function() {
      $scope.savingBus = true;
      $scope.newBus.hotelId = $scope.selectedHotel.id;
      $http({
        method: 'POST',
        url: '/api/buses/',
        data: $scope.newBus
      }).then(
        function(res) {
          $rootScope.buses.push(res.data);
          $('#newBusModal').modal('hide');
          $scope.newBus = null;
          $scope.savingBus = false;
        },
        function(err) {
          $scope.error = err.data.error;
          $scope.savingBus = false;
        }
      );
    }

    $scope.saveHotel = function() {
      $scope.savingHotel = true;
      $http({
        method: 'POST',
        url: '/api/hotels/',
        data: $scope.newHotel
      }).then(
        function(res) {
          $scope.hotels.push(res.data);
          $('#newHotelModal').modal('hide');
          $scope.newHotel = null;
          $scope.savingHotel = false;
        },
        function(err) {
          $scope.hotelError = err.data.error;
          $scope.savingHotel = false;
        }
      );
    }

    $scope.createMenuItem = function() {
      $scope.savingMenuItem = true;
      $scope.newMenuItem.hotelId = parseInt($scope.currentBus.hotelId);
      $scope.newMenuItem.price = parseInt($scope.newMenuItem.price);
      $http({
        method: 'POST',
        url: '/api/menuItems/',
        data: $scope.newMenuItem
      }).then(
        function(res) {
          $scope.menu.push(res.data);
          $scope.savingMenuItem = false;
        },
        function(err) {
          $scope.menuError = err.data.error;
          $scope.savingMenuItem = false;
        }
      );
    }

    $scope.deleteMenuItem = function(id) {
      $scope.deletingMenuItem = true;
      $http({
        method: 'PUT',
        url: '/api/menuItems/' + id
      }).then(
        function(res) {
          $scope.savingMenuItem = false;
          _getMenuItemsByHotelId();
        },
        function(err) {
          $scope.deletingMenuItem = false;
        }
      );
    }

    $scope.saveBus = function() {
      $scope.currentBus.hotelId = $scope.selectedHotel.id;
      $http({
        method: 'PUT',
        url: '/api/buses/' + $scope.currentBus.id,
        data: $scope.currentBus
      }).then(
        function(res) {
          _getCurrentBusById();
        },
        function(err) {}
      );
    }
  }
}());


(function() {
  'use strict';

  www.controller('homeCtrl', ['$scope', '$rootScope', '$http', 'async', '$location', homeCtrl]);

  function homeCtrl($scope, $rootScope, $http, async, $location) {
    $scope.appPromise.then(init);
    $scope.ordersLoaded = false;
    $scope.loadingOrders = false;
    $scope.seatNo = null;

    function init() {
      async.series([
          _getBus,
          _getHotel,
          _getMenuItems
        ],
        function(err) {
          if (err) {
            alert(err);
          }
        }
      );
    }

    function _getBus(next) {
      $http.get('/api/buses/regNo/' + $location.search()['busRegNo']).then(function(res) {
        $scope.bus = res.data;
        return next();
      });
    }

    function _getHotel(next) {
      $http.get('/api/hotels/' + $scope.bus.hotelId).then(function(res) {
        $scope.hotel = res.data;
        return next();
      });
    }

    function _getMenuItems(next) {
      $http.get('/api/menuItems/' + $scope.bus.hotelId).then(function(res) {
        $scope.menuItems = res.data;
        console.log("bus", $scope.menuItems);
        $scope.menu = _.groupBy(res.data, 'group');
        return next();
      });
    }

    $scope.selectSeat = function() {
      $scope.ordersLoaded = false;
      $scope.loadingOrders = true;
      if (!$scope.seatNo) {
        return;
      }
      $http.get('/api/orders/' + $scope.bus.id + '/' + $scope.seatNo).then(function(res) {
        console.log("orders", res.data);
        $scope.orders = res.data;
        $scope.orders.length !== 0 ? $scope.isSaveDisabled = true : $scope.isSaveDisabled = false;
        _.each($scope.menuItems,
          function(menuItem) {
            if (_.findWhere($scope.orders, {
                menuItemId: menuItem.id
              }))
              menuItem.quantity = _.findWhere($scope.orders, {
                menuItemId: menuItem.id
              }).quantity;
            else
              menuItem.quantity = null;
          }
        );
        $scope.loadingOrders = false;
        $scope.ordersLoaded = true;
        return;
      });
    }

    $scope.getPrice = function() {
      var price = 0;
      _.each($scope.menuItems,
        function(menuItem) {
          price += menuItem.price * menuItem.quantity;
        }
      );
      return price;
    }

    $scope.groupOpen = function() {
      $('.ui.accordion').accordion({
        exclusive: false
      });
    }

    $scope.ordersList = function() {
      return _.filter($scope.menuItems,
        function (item) {
          return item.quantity;
        }
      );
    }

    $scope.addItem = function(item) {
      item.quantity ++;
    }
  }
}());
