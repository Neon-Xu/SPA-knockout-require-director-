define(['ko', 'director'], function(ko) {

    var routeMap = [
        {
            url: '/',
            params: {
                page: 'home'
            }
        }
    ];

    function __Router() {
        var currentRoute = this.currentRoute = ko.observable({page: 'home'});

        var router = new Router();
        ko.utils.arrayForEach(routeMap, function(route) {
            router.on(route.url, function() {
                var requestParams = Array.prototype.slice.call(arguments);
                currentRoute(ko.utils.extend({
                    urlDatas: requestParams
                }, route.params));
            })
        });
        router.init('/');
        router.configure({
            notfound: function() {
                currentRoute({page: 'page-404'});
            }
        })
    }
    return new __Router();
})
