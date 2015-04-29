'use strict';
app.config(function ($stateProvider) {
    $stateProvider.state('listItem', {
        url        : '/listitem/:listItemId',
        templateUrl: 'js/listitem/listitem.html',
        controller : "ListItemController"
    });
});

app.controller("ListItemController", function ($scope, ProductFactory, CategoryFactory, ListItemFactory, ReviewsFactory, $stateParams) {

    $scope.id = $stateParams.listItemId;

    ListItemFactory.getSingleListItem($stateParams.listItemId).then(function (listitem) {
        $scope.listitem = listitem;
        return listitem;
    });
});

app.factory("ListItemFactory", function ($http) {

    function createListItem (item) {
        return $http.post('/api/listitems', item).then(returnResponse);
    }

    function editListItem (item) {
        return $http.put('/api/listitems/' + item._id, item).then(returnResponse);
    }

    function deleteListItem (item) {
        return $http.delete("/api/listitems/" + item._id).then(returnResponse);
    }

    return {
        getListItemsForCategory: function (cat_id) {
            //:cat_id will be changed after the backend is done
            return $http.get("/api/listitems/category/" + cat_id).then(returnResponse);
        },
        getSingleListItem      : function (listItemId) {
            return $http.get("/api/listitems/item/" + listItemId).then(returnResponse);
        },
        getListItems           : function () {
            return $http.get("/api/listitems").then(returnResponse);
        },
        createListItem         : createListItem,
        editListItem           : editListItem,
        deleteListItem         : deleteListItem
    };
});