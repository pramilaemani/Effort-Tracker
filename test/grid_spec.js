var protractor = require('protractor');
path = require('path');
var driver = require('selenium-webdriver');

//fetch data from the excel in order to provide data to the test cases
cellFromXLS = function (cellId) {
    'use strict';
    //Define sheetNumber
    var sheetNumber = 0;
    //Define file Path name    
                var fileNamePath = path.join('C:/NewEffortTracker-master/test/', 'data.xls');     
    //NodeJs read file
    var XLS;
    if (typeof require !== 'undefined') {
        XLS = require('xlsjs');
    }
    //Working with workbook
    var workbook = XLS.readFile(fileNamePath);
    var sheetNamelist = workbook.SheetNames;
    var value = workbook.Sheets[sheetNamelist[sheetNumber]][cellId].v;
    return value;
};

function waitForElementToBePresent(element){
browser.wait(function () {
return element.isPresent();
},60000);

browser.wait(function () {
return element.isDisplayed();
},60000);
};

Object.assign(global, {
  waitUntilURLContains: string => {
    let fn = () => {
      return browser.driver.wait(() => {
        return browser.driver.getCurrentUrl().then((url) => {
          return url.includes(string);
        });
      }, 80000);
    }

    return fn.bind(null, string);
  }
});

describe('Effort Tracker App Test', function() {
         
            // ptor = protractor.getInstance();
      it('should register user', function() {
          browser.driver.get('http://localhost:3000/register');
          browser.ignoreSynchronization = true
          var fname = cellFromXLS('D2');
          var lname = cellFromXLS('E2');
          var email = cellFromXLS('F2');
          var uname = cellFromXLS('B2');
          var pwd = cellFromXLS('C2');

          var Username = element(by.id("username"));
          var Password = element(by.id("password"));
          var firstname = element(by.xpath(".//*[@id='firstName']"));
          var lastname = element(by.xpath(".//*[@id='lastName']"));
          var mail = element(by.xpath(".//*[@id='email']"));
          var user = element(by.xpath(".//*[@id='username']"));
          var passwd = element(by.xpath(".//*[@id='password']"));
          // var login = element(by.xpath(".//*[@id='login']"));
          var register = element(by.xpath("html/body/div[1]/form/div[6]/button"));
              
              firstname.sendKeys(fname);
              lastname.sendKeys(lname);
              mail.sendKeys(email);
              user.sendKeys(uname);
              passwd.sendKeys(pwd);

               register.click().then(waitUntilURLContains('login'));      
             
           expect(element(by.xpath('html/body/div[1]/div')).getText()).toEqual('Registration successful');
           });


      it('should login user and update account', function() {
          browser.get('http://localhost:3000/login');
          var uname = cellFromXLS('B3');
          var pwd = cellFromXLS('C3');

          var prjinput = cellFromXLS('G3');
                   
          var user = element(by.xpath(".//*[@id='username']"));
          var passwd = element(by.xpath(".//*[@id='password']"));
          var login = element(by.xpath(".//*[@id='login']"));
          var accountlink = element(by.xpath(".//*[@id='main-nav']/li[2]/a"));
              
                       
              user.sendKeys(uname);
              passwd.sendKeys(pwd);

              login.click().then(waitUntilURLContains('app/#/'));

              accountlink.click().then(waitUntilURLContains('account'));

          var project = element(by.xpath(".//*[@id='menu1']/main/div/form/fieldset/table/tbody/tr[4]/td/select"));
          
            project.sendKeys(prjinput);
               
           expect(element(by.xpath('.//*[@id=\'menu1\']/main/h1')).getText()).toEqual('Hi test04!!');
      }); 

      /*it('should create a task', function() {

          browser.get('http://localhost:3000/login');

          var uname = cellFromXLS('B3');
          var pwd = cellFromXLS('C3');

          var project = element(by.xpath(".//*[@id='task-form']/tbody/tr[1]/td[2]/select"));
          var assignedTo = element(by.xpath(".//*[@id='task-form']/tbody/tr[1]/td[6]/select"));
          var taskName = element(by.xpath(".//*[@id='task-form']/tbody/tr[2]/td[2]/input"));
          var taskStatus = element(by.xpath(".//*[@id='task-form']/tbody/tr[2]/td[6]/select"));
          var estimatedStartDate = element(by.xpath(".//*[@id='estdate']"));
          var estimatedEndDate = element(by.xpath(".//*[@id='password']"));
          var actualStartDate = element(by.xpath(".//*[@id='login']"));
          var actualEndDate = element(by.xpath(".//*[@id='main-nav']/li[2]/a")); 
          var estimatedEffort = element(by.xpath(".//*[@id='main-nav']/li[2]/a")); 
          var actualEffort = element(by.xpath(".//*[@id='main-nav']/li[2]/a")); 
          var storyPoint = element(by.xpath(".//*[@id='main-nav']/li[2]/a")); 


        });  */  

      });    
