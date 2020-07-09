(function () {
    'use strict';

    angular
        .module('services.departments', [])
        .service('departmentsSvc', DepartmentsSvc);

    DepartmentsSvc.$inject = ['$q', 'ShptRestService'];
    function DepartmentsSvc($q, ShptRestService) {
        var svc = this;
        var listname = 'Department';
        var curUserId = _spPageContextInfo.userId;
        var departmentsList = null;

        svc.getAllItems = function () {
            var defer = $q.defer();
            var queryParams = "$select=Id,Title";
            ShptRestService
                .getListItems(listname, queryParams)
                .then(function (data) {
                    departmentsList = [];
                    _.forEach(data.results, function (o) {
                        var dept = {};
                        dept.id = o.Id;
                        dept.title = o.Title;
                        departmentsList.push(dept);
                    });
                    defer.resolve(_.orderBy(departmentsList, ['title'], ['asc']));
                })
                .catch(function (error) {
                    defer.reject(error);
                });
            return defer.promise;
        };

        svc.AddItem = function (dept) {
            var defer = $q.defer();
            var itemExists = _.some(departmentsList, ['title', dept.title]);

            if (itemExists) {
                defer.reject("The item specified already exists in the system. Contact IT Service desk for support.");
            } else {

                var data = {
                    Title: dept.title
                };

                ShptRestService
                    .createNewListItem(listname, data)
                    .then(function (response) {
                        dept.id = response.ID;
                        departmentsList.push(dept);
                        defer.resolve(_.orderBy(departmentsList, ['title'], ['asc']));
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
                        _.remove(departmentsList, {
                            id: id
                        });
                        defer.resolve(_.orderBy(departmentsList, ['title'], ['asc']));
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