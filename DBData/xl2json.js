var xlsx_json = require('xlsx-to-json')

xlsx_json({
  input: __dirname + '/taskDB.xlsx',
  output: __dirname + '/tasks.json'
}, function(err, result) {
  if(err) {
    console.error(err);
  }else {
    console.log(result);
  }

});

