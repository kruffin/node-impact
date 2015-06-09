var express = require('express'),
    path = require('path'),
    impact = require('../lib'),
    port = 8080,
    app = express();

//Paths for Weltmesiter API
app.get('/lib/weltmeister/api/glob.php', function(req, res){
    res.redirect('/wm/glob');
});
    
app.get('/lib/weltmeister/api/browse.php', function(req, res){
    res.redirect('/wm/browse');
});
    
app.get('/lib/weltmeister/api/save.php', function(req, res){
    res.redirect('/wm/save');
});

//Normal routing for ImpactJS
app.use('/lib', express.static('impact_core/lib'));
app.use('/media', express.static('impact_core/media'));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.get('/wm', function(req, res){
  res.sendFile(path.join(__dirname + '/views/weltmeister.html'));
});

var im = impact.listen(app, { root: __dirname + '/impact_core' });

app.listen(port);

console.log('app listening on port', port);