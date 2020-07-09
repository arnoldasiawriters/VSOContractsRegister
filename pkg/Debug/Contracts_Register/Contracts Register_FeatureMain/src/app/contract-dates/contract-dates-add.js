(function () {
    'use strict';

    angular
        .module('contractsAdd', [])
        .controller('contractsAddCtrl', ContractsCtrlFunction);

    ContractsCtrlFunction.$inject = ['$q', '$route', '$dialog', 'contractsSvc', 'countriesSvc', 'departmentsSvc', 'costCentersSvc', 'currenciesSvc','spinnerService', 'growl'];
    function ContractsCtrlFunction($q, $route, $dialog, contractsSvc, countriesSvc, departmentsSvc, costCentersSvc, currenciesSvc, spinnerService, growl) {
        var ctrl = this;
        ctrl.expiryninetydays = 0;
        ctrl.expirysixetydays = 0;
        ctrl.expirythirtydays = 0;
        ctrl.expiryexpired = 0;

        ctrl.contracts = [];

        var promises = [];
        promises.push(countriesSvc.getAllItems());
        promises.push(departmentsSvc.getAllItems());
        promises.push(costCentersSvc.getAllItems());
        promises.push(currenciesSvc.getAllItems());

        $q
            .all(promises)
            .then(function (results) {
                ctrl.countries = results[0];
                ctrl.departments = results[1];
                ctrl.costcenters = results[2];
                ctrl.currencies = results[3];
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