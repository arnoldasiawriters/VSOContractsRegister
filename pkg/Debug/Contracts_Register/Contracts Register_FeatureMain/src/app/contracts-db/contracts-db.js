(function () {
    'use strict';

    angular
        .module('contracts', [])
        .controller('contractsCtrl', ContractsCtrlFunction);

    ContractsCtrlFunction.$inject = ['$q', '$route', '$dialog', 'contractsSvc', 'countriesSvc', 'departmentsSvc', 'spinnerService', 'growl'];
    function ContractsCtrlFunction($q, $route, $dialog, contractsSvc, countriesSvc, departmentsSvc, spinnerService, growl) {
        var ctrl = this;
        ctrl.expiryninetydays = 0;
        ctrl.expirysixetydays = 0;
        ctrl.expirythirtydays = 0;
        ctrl.expiryexpired = 0;

        ctrl.contracts = [];

        var promises = [];
        promises.push(countriesSvc.getAllItems());
        promises.push(departmentsSvc.getAllItems());
        //promises.push(contractsSvc.getAllItems());

        $q
            .all(promises)
            .then(function (results) {
                ctrl.countries = results[0];
                ctrl.departments = results[1];
                ctrl.statuses = ["Active", "Expired", "Archived"]
                ctrl.status = "Active";
               //ctrl.contracts = results[2];
            })
            .catch(function (error) {
                growl.error(error);
            })
            .finally(function () {
                spinnerService.closeAll();
            });
    }
})();