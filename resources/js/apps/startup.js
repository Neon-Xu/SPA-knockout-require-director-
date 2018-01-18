

require.config(REQUIRE_CONFIG);
require(['jquery', 'ko', 'apps/router'], function($, ko, router) {

	ko.components.register('home', { require: '../../resources/components/home/home' });
	ko.components.register('page-404',  { require: '../../resources/components/404/404' });

	ko.applyBindings({ route: router.currentRoute })

})
