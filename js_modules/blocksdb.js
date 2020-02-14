var Datastore = require('nedb')
  , db = new Datastore({ filename: './databases/blocks.db', autoload: true });
  db.persistence.setAutocompactionInterval(1000 * 30);

  function getBlock(bn) {
    return new Promise((resolve, reject) => {
        db.findOne({}, (err,data) => {
               if(err) {
                      reject(err);
               } else {
if (data) {
                resolve(data);
} else {
  var data = {};
  data.last_block = bn;
  resolve(data);
 }
              }
        });
    });
}

function updateBlock(id) {
  return new Promise((resolve, reject) => {
  db.update({}, {last_block: id}, {upsert:true}, (err, result) => {
if (err) {
  reject(err);
} else {
       resolve(result);
}
  });
  });
}

module.exports.getBlock = getBlock;
module.exports.updateBlock = updateBlock;