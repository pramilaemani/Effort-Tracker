(function () {
    'use strict';

    angular
        .module('app')
        .controller('Task.IndexController', taskController);

    function taskController($window, $scope, TaskService, UserService, FlashService) {
        var vm = this;
        vm.users=null;
        vm.projects=null;
        vm.status=null;
        vm.createTask = createTask;
        /*vm.addRow = addRow;*/

        
        getProjects();
        getAllUsers();
        getStatus();


        function createTask() {
            TaskService.createTask(vm.task)
                .then(function () {
                    FlashService.Success('Task created');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function getProjects(){
            TaskService.getAllProjects()
            .then(function (projects){
                vm.projects = projects;
            });
        }

        function getStatus(){
            TaskService.getAllStatus()
            .then(function (status){
                vm.status = status;
            });
        }

        function getAllUsers(){
            UserService.GetAllUsers()
            .then(function (users){
                vm.users = users;
            });
        }

        /*function addRow() {
        var newService = {
            "id" : "0",
            "category" : "public",
            "exposednamespace" : "http://bced.wallonie.be/services/",
            "exposedoperation" : "-",
            "exposedws" : "-",
            "path" : "//*[local-name()='-']/text()",
            "provider" : "BCED",
            "version" : "1.0"
        };
        var rowTmp = {};
        rowTmp.entity = newService;
        vm.editRow($scope.vm.serviceGrid, rowTmp);
        };   */                  
    }

})();