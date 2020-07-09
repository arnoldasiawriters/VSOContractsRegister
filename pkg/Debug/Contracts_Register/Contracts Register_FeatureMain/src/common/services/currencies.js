(function () {
    'use strict';

    angular
        .module('services.currencies', [])
        .service('currenciesSvc', CurrenciesSvc);

    CurrenciesSvc.$inject = ['$q', 'ShptRestService'];
    function CurrenciesSvc($q, ShptRestService) {
        var svc = this;
        var listname = 'Currencies';
        var curUserId = _spPageContextInfo.userId;
        var currenciesList = null;

        svc.getAllItems = function () {
            var defer = $q.defer();
            var queryParams = "$select=Id,Title";
            ShptRestService
                .getListItems(listname, queryParams)
                .then(function (data) {
                    currenciesList = [];
                    _.forEach(data.results, function (o) {
                        var currency = {};
                        currency.id = o.Id;
                        currency.title = o.Title;
                        currenciesList.push(currency);
                    });
                    defer.resolve(_.orderBy(currenciesList, ['title'], ['asc']));
                })
                .catch(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        };

        svc.AddItem = function (currency) {
            var defer = $q.defer();
            var itemExists = _.some(currenciesList, ['title', currency.title]);

            if (itemExists) {
                defer.reject("The item specified already exists in the system. Contact IT Service desk for support.");
            } else {

                var data = {
                    Title: currency.title
                };

                ShptRestService
                    .createNewListItem(listname, data)
                    .then(function (response) {
                        currency.id = response.ID;
                        currenciesList.push(currency);
                        defer.resolve(_.orderBy(currenciesList, ['title'], ['asc']));
                    })
                    .catch(function (error) {
                        console.log(error);
                        defer.reject("An error occured while adding the item. Contact IT Service desk for support.");
                    });
            }
            return defer.promise;
        };

        svc.DeleteItem = function (id) {
            var defer = $q.defer();
            if (id) {
                ShptRestService
                    .deleteListItem(listname, id)
                    .then(function () {
                        _.remove(currenciesList, {
                            id: id
                        });
                        defer.resolve(_.orderBy(currenciesList, ['title'], ['asc']));
                    })
                    .catch(function (error) {
                        console.log(error);
                        defer.reject("An error occured while deleting the item. Contact IT Service desk for support.");
                    });
            } else {
                defer.reject('Item to be deleted is missing Id. Contact IT Service desk for support.');
            }
            return defer.promise;
        };
    }
})();