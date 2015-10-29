var fs = require('fs'),
    path = require('path'),
    glob = require('glob');
    
exports.listen = function(server, options) {
  var options = options || {};
  var root = options.root || __dirname;
  
  server.get('/wm/glob', function(req, res){
    glob.glob(root + path.sep + req.query['glob'][0], 0, function(e, matches){
      for (var i in matches) matches[i] = matches[i].substring(root.length + path.sep.length); // also get rid of separator
      res.send(matches);
    });
  });

  server.post('/wm/save', function(req, res){
    var fpath = req.query.path || req.body.path,
        data = req.query.data || req.body.data;
        
    if (fpath && data) {
      if (/\.js$/.test(fpath)) {
        fs.writeFile(path.join(root, fpath), data, function(err){
          if (err) {
            res.send({ error: 2, msg: 'Couldn\'t write to file: '+ fpath });
          } else {
            res.send({ error: 0 });
          }
        });
      } else {
        res.send({ error: 3, msg: 'File must have a .js suffix' });
      }
    } else {
      res.send({ error: 1, msg: 'No Data or Path specified' });
    }
  });

  server.get('/wm/browse', function(req, res){
    var dir = req.query.dir || '',
        type = req.query.type,
        types = { scripts: ['.js'], images: ['.png', '.gif', '.jpg', '.jpeg'] },
        result = { parent: false, dirs: [], files: [] };
        
    var filter = (type && types[type]) ? types[type] : false;
        
    result.parent = req.query.dir ? dir.substring(0, dir.lastIndexOf('/')) : false;
    
    if (dir[dir.length-1] === '/') dir = dir.substring(0, dir.length-1);
    dir += '/';
    var dirpath = path.normalize(path.join(root, dir));
    
    var stats;
    fs.readdir(dirpath, function(err, files){
      for (var i in files) {
        stats = fs.statSync(dirpath + files[i]);
        if (stats.isDirectory()) {
          result.dirs.push(dir + files[i]);
        } else if (stats.isFile()) {
          if (filter) {
            if (filter.indexOf(path.extname(files[i])) >= 0) {
              result.files.push(dir + files[i]);
            }
          } else {
            result.files.push(dir + files[i]);
          }
        }
      }
      res.send(result);
    });
  });
  
  return {
    root: root
  };
};