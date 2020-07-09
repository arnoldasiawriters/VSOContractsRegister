(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngAnimate', 'directives.dirPagination', 'ui.bootstrap', 'ui.bootstrap.dialogs', 'selectFile', 'services.utilities', 'spNgModule', 'sarsha.spinner',
            'angular-growl', 'sp-peoplepicker', 'datatables', 'services.countries', 'services.contracts', 'services.costcenters', 'services.currencies', 'services.departments',
            'services.doctypes', 'dir.adminmenu', 'dir.backbtn', 'dir.addbtn', 'contracts', 'contractsAdd', 'countries'])
        .constant("IS_APP_WEB", false)
        .config(['growlProvider', GrowlProvider])
        .config(['$routeProvider', RouteProvider]);

    RouteProvider.$inject = ['$routeprovider'];
    function RouteProvider($routeprovider) {
        $routeprovider
            .when('/dashboard', {
                templateUrl: 'app/contracts-db/contracts-db.tpl.html',
                controller: 'contractsCtrl as ctrl'
            })
            .when('/addContract', {
                templateUrl: 'app/contract-dates/contract-dates-add.tpl.html',
                controller: 'contractsAddCtrl as ctrl'
            })
            //Manage Admin Countries
            .when('/listAdminCountries', {
                templateUrl: 'app/adm-countries/countries-list.tpl.html',
                controller: 'countriesCtrl as ctrl',
                param: 'list'
            })
            .when('/addAdminCountries', {
                templateUrl: 'app/adm-countries/countries-add.tpl.html',
                controller: 'countriesCtrl as ctrl'
            })
            .otherwise({
                redirectTo: '/dashboard'
            });
    }

    GrowlProvider.$inject = ['growlProvider'];
    function GrowlProvider(growlProvider) {
        growlProvider.globalTimeToLive({ success: 20000, error: -1, warning: 20000, info: 20000 });
        //growlProvider.globalTimeToLive(-1);
        growlProvider.globalDisableCountDown(true);
    }
})();