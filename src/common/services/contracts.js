(function () {
    'use strict';

    angular
        .module('services.contracts', [])
        .service('contractsSvc', ContractsSvc);

    ContractsSvc.$inject = ['$q'];
    function ContractsSvc($q) {
        var svc = this;
        var listname = 'Contracts';
        var curUserId = _spPageContextInfo.userId;
        var contractsList = null;

        svc.getAllItems = function () {
            var defer = $q.defer();
            var queryParams = "$select=Id,Title,StartDate,EndDate,Value,ContractStatus,Department/Id,Department/Title,CostCenter/Id,CostCenter/Title," +
                "Currency/Id,Currency/Title,ContractManagers/Id,ContractManagers/Title&$expand=Department,CostCenter,Currency,ContractManagers";
            ShptRestService
                .getListItems(listname, queryParams)
                .then(function (data) {
                    contractsList = [];
                    _.forEach(data.results, function (o) {
                        var contract = {};
                        contract.id = o.Id;
                        contract.title = o.Title;
                        contract.startdate = new Date(o.StartDate);
                        contract.enddate = new Date(o.EndDate);
                        contract.value = o.Value;
                        contract.status = o.ContractStatus;
                        contract.department = _.isNil(o.Department) ? "" : { id: o.Department.Id, title: o.Department.Title };
                        contract.costcenter = _.isNil(o.CostCenter) ? "" : { id: o.CostCenter.Id, title: o.CostCenter.Title };
                        contract.currency = _.isNil(o.Currency) ? "" : { id: o.Currency.Id, title: o.Currency.Title };
                        contract.managers = [];
                       //if (o.ContractManagers.hasOwnProperty(results)) {
                            _.forEach(o.ContractManagers.results, function (manager) {
                                contract.managers.push({ id: manager.Id, title: manager.Title});
                            });
                        //}
                        contractsList.push(contract);
                    });
                    defer.resolve(_.orderBy(contractsList, ['startdate'], ['desc']));
                })
                .catch(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        };
    }
})();