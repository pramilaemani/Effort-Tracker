var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var dateformat = require('dateformat');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('tasks');

var service = {};

service.createTask = createTask;
service.getAllTasks = getAllTasks;
service.getSelTasks = getSelTasks;
service.getAllProjects = getAllProjects;
service.getAllStatus = getAllStatus;
service.update = update;
service.deleteTask = deleteTask;

module.exports = service;


function getAllTasks(){
	var deferred = Q.defer();    
	db.tasks.find().toArray(function(err, result){
		if (err) 
			deferred.reject(err.message);
		if (result){    
            deferred.resolve(result);
		}        
	});    
	return deferred.promise;
}

function getSelTasks(project){  
  var deferred = Q.defer();
  db.tasks.find({'projectName':project}).toArray(function(err, result){
    if (err) 
      deferred.reject(err.message);
    if (result){
    console.log(result);
            deferred.resolve(result);
    }        
  });    
  return deferred.promise;
}

function getAllProjects(){
  var deferred = Q.defer();
  db.bind('projects');    
  db.projects.find().toArray(function(err, result){
    if (err) 
      deferred.reject(err.message);
    if (result){            
            deferred.resolve(result);
    }        
  });    
  return deferred.promise;
}

function getAllStatus(){
  var deferred = Q.defer(); 
  db.bind('taskStatuses');   
  db.taskStatuses.find().toArray(function(err, result){
    if (err) 
      deferred.reject(err.message);
    if (result){            
            deferred.resolve(result);
    }        
  });    
  return deferred.promise;
}

function createTask(taskParam){
   var deferred = Q.defer();
   //check if the task exists
   db.tasks.findOne({"TaskName":taskParam.taskName, 
                     "TaskStatus":taskParam.taskStatus}, function(err, task){
            if (err) deferred.reject(err.name + ': ' + err.message);
            console.log(taskParam.estimatedStartDate);
            console.log(taskParam.estimatedEndDate);
            console.log(taskParam.actualStartDate);
            console.log(taskParam.actualEndDate);
            if (task) {
                deferred.reject("TaskName " +taskParam.taskName+" already exists");
            }   else {
                create();
                    }
                });
   
   function create(){

    var task = { TaskName :  taskParam.taskName, 
                 Project : taskParam.projectName.ProjectName, 
                 Resource : taskParam.username.username, 
                 TaskStatus : taskParam.status.status, 
                 EstimatedStartDate : new Date(taskParam.estimatedStartDate),
                 EstimatedEndDate :  new Date(taskParam.estimatedEndDate), 
                 ActualStartDate : new Date(taskParam.actualStartDate), 
                 EstimatedEffort : taskParam.estimatedEffort,
                 ActualEffort : taskParam.actualEffort, 
                 ActualEndDate : new Date(taskParam.actualEndDate)};
                     
    db.tasks.insert(
            task,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
                console.log(doc);
                deferred.resolve(doc);

            });

   }
   return deferred.promise;
}

function update(taskParam) {
    var deferred = Q.defer();
    var _id = taskParam._id;
    // validation
    console.log(taskParam);
    db.tasks.findById(_id, function (err, task) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        console.log(task);               

        if (task.taskName !== taskParam.taskName) {
            // task has changed so check if the new task is already taken
            db.tasks.findOne(
                { taskName: taskParam.taskName },
                function (err, task) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (task) {
                        
                        // Task already exists
                        deferred.reject('Task "' + req.body.taskName + '" is already taken')
                    } else {
                        updateTask();
                    }
                });
        } else {
            updateTask();
        }
    });

    function updateTask() {
        // fields to update
        var set = {
                 TaskName :  taskParam.TaskName, 
                 Project : taskParam.Project, 
                 Resource : taskParam.Resource, 
                 TaskStatus : taskParam.TaskStatus, 
                 EstimatedStartDate : taskParam.EstimatedStartDate,
                 EstimatedEndDate :  taskParam.EstimatedEndDate, 
                 ActualStartDate : taskParam.ActualStartDate, 
                 EstimatedEffort : taskParam.EstimatedEffort,
                 ActualEffort : taskParam.ActualEffort, 
                 ActualEndDate : taskParam.ActualEndDate,

        };          

        db.tasks.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function deleteTask(_id) {
    var deferred = Q.defer();

    db.tasks.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}
