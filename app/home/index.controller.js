(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);                
     
    function Controller($rootScope, $scope, $http, UserService, 
                        TaskService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.tasks = null;
        vm.projects=null;
        /*vm.deleteSelected = deleteSelected;*/
        // vm.getSelTasks = getSelTasks;        
        initController();
        getTasks();
        
        
        // getAllProjects();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }

        /*function deleteSelected() {
  
            TaskService.deleteTask(vm.task)
                .then(function () {
                    FlashService.Success('Task deleted');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }*/

        $scope.deleteSelected = function(){
         
          angular.forEach($scope.gridApi.selection.getSelectedRows(), function (data, index) {
            $scope.taskGrid.data.splice($scope.taskGrid.data.lastIndexOf(data), 1);

                TaskService.deleteTask(data._id)
                    .then(function(){
                        FlashService.Success('Task deleted');
                    })
                    .catch(function (error){
                        FlashService.Error(error);
                    });
           });
        }

        $scope.taskGrid = {
        columnDefs: [ 
            {   field : 'Project'}, 
            {   field : 'Resource'}, 
            {   field : 'TaskName'}, 
            {   field : 'TaskStatus'}, 
            {   field : 'EstimatedStartDate', cellFilter: 'date:"yyyy-MM-dd"'}, 
            {   field : 'EstimatedEndDate', cellFilter: 'date:"yyyy-MM-dd"'}, 
            {   field : 'ActualStartDate', cellFilter: 'date:"yyyy-MM-dd"'}, 
            {   field : 'ActualEndDate', cellFilter: 'date:"yyyy-MM-dd"'}, 
            {   field : 'EstimatedEffort'} , 
            {   field : 'ActualEffort'}  
            ],               
        enableGridMenu: true,
        enableCellEdit: true,
        enableSelectAll: true,        
        
        enableRowHeaderSelection : true,
        multiSelect : true,
        enableSorting : true,
        enableFiltering : true       
        }
    
        function getTasks(){
            TaskService.getTasks().then(function (tasks){                              
                    $scope.taskGrid.data = tasks;                    
            });
        }

        $scope.taskGrid.onRegisterApi = function(gridApi) {
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
        //Do your REST call here via $hhtp.get or $http.post
        //This alert just shows which info about the edit is available
        alert('Column:  ' + colDef.name + '  with ID:  ' + rowEntity._id +
              ';  Project:' + rowEntity.Project + 
              ';  Resource:' + rowEntity.Resource +
              ';  TaskName:' + rowEntity.TaskName + 
              ';  TaskStatus:' + rowEntity.TaskStatus + 
              ';  EstimatedStartDate:' + rowEntity.EstimatedStartDate + 
              ';  EstimatedEndDate:' + rowEntity.EstimatedEndDate + 
              ';  ActualStartDate:' + rowEntity.ActualStartDate + 
              ';  ActualEndDate:' + rowEntity.ActualEndDate +
              ';  EstimatedEffort:' + rowEntity.EstimatedEffort + 
              '  ActualEffort:' + rowEntity.ActualEffort + ';  is being changed');
        
        TaskService.updateTask(rowEntity)
                .then(function () {
                    FlashService.Success('Task updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
        });
        
      });
    };



    }



        /*function editRow(grid, row) {
            alert("in the edit row");
        $modal.open({
            templateUrl : 'service-edit.html',
            controller : [ '$http', '$modalInstance', 'grid', 'row', RowEditCtrl ],
            controllerAs : 'vm',
            resolve : {
                grid : function() {
                    return grid;
                },
                row : function() {
                    return row.entity;
                }
            }
        });
    }
       */

    /*function remove() {
        console.dir(row)
        if (row.entity.id != '0') {
            row.entity = angular.extend(row.entity, vm.entity);
            var index = grid.appScope.vm.taskGrid.data.indexOf(row.entity);
            grid.appScope.vm.taskGrid.data.splice(index, 1);
            
             * $http.delete('http://localhost:8080/service/delete/'+row.entity.id).success(function(response) { $modalInstance.close(row.entity); }).error(function(response) { alert('Cannot delete row (error in console)'); console.dir(response); });
             
        }
        $modalInstance.close(row.entity);
    }*/
        /*function getSelTasks(){
            var project = vm.task.projectName.ProjectName;
            
            TaskService.getSelTasks(project).then(function(tasks){

                $scope.tasks = tasks;
            });
        }

        function getAllProjects(){                                                  
            TaskService.getAllProjects()
            .then(function (projects){
                vm.projects = projects;
            });
      }*/
      

    /*function RowEditCtrl($http, $modalInstance, grid, row) {
    var vm = this;
    
    vm.entity = angular.copy(row.entity);
        vm.save = save;
        vm.remove = remove;
    
    function save() {
        if (row.entity.id == '0') {
            
            $http.post('http://localhost:8080/service/save', row.entity).success(function(response) { $modalInstance.close(row.entity); }).error(function(response) { alert('Cannot edit row (error in console)'); console.dir(response); });
             
            row.entity = angular.extend(row.entity, vm.entity);
            //real ID come back from response after the save in DB
            row.entity.id = Math.floor(100 + Math.random() * 1000);
            
            grid.data.push(row.entity);

        } else {
            row.entity = angular.extend(row.entity, vm.entity);
            
             * $http.post('http://localhost:8080/service/save', row.entity).success(function(response) { $modalInstance.close(row.entity); }).error(function(response) { alert('Cannot edit row (error in console)'); console.dir(response); });
             
        }
        $modalInstance.close(row.entity);
    } 

    vm.remove = remove;
    function remove() {
        console.dir(row)
        if (row.entity.id != '0') {
            row.entity = angular.extend(row.entity, vm.entity);
            var index = grid.appScope.vm.taskGrid.data.indexOf(row.entity);
            grid.appScope.vm.taskGrid.data.splice(index, 1);
            
              $http.delete('http://localhost:8080/service/delete/'+row.entity.id).success(function(response) { $modalInstance.close(row.entity); }).error(function(response) { alert('Cannot delete row (error in console)'); console.dir(response); });
             
        }
        $modalInstance.close(row.entity);
    }

}*/

    
})();