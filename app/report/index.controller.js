(function () {
    'use strict';

    angular
        .module('app')
        .controller('Report.IndexController', reportController);

    function reportController($scope, $http, TaskService, FlashService) {
        var vm = this;
$scope.gridOptions = {};
        vm.user = null;
        vm.tasks = null;        
        vm.projects = null;      
        getReport();

$scope.gridOptions = {
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
    exporterCsvFilename: 'myFile.csv',
    exporterPdfDefaultStyle: {fontSize: 9},
    exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
    exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
    exporterPdfHeader: { text: "My Header", style: 'headerStyle' },
    exporterPdfFooter: function ( currentPage, pageCount ) {
      return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
    },
    exporterPdfCustomFormatter: function ( docDefinition ) {
      docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
      docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
      return docDefinition;
    },
    exporterPdfOrientation: 'portrait',
    exporterPdfPageSize: 'LETTER',
    exporterPdfMaxGridWidth: 500,
    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location"))
    
  }; 

   $scope.gridOptions.onRegisterApi = function(gridApi) {
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
        //Do your REST call here via $hhtp.get or $http.post
        //This alert just shows which info about the edit is available
        alert('Column: ' + colDef.name + ' ID: ' + rowEntity._id + ' Name: ' + rowEntity.name + ' Age: ' + rowEntity.age);
        TaskService.updateTask(rowEntity)
                .then(function () {
                    FlashService.Success('Task updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
        });
        
      });
    };

  

  function getReport() {           
    TaskService.getTasks().then(function (tasks){
      $scope.gridOptions.data = tasks;
      
    });            
  }

 }

})();