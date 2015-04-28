app.factory("FacebookFactory", function($http){
    return {
        getLikes : function() {
            return $http.get("/api/facebook/likes").then(returnResponse);
        }
    };
});