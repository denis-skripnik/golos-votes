var Datastore = require('nedb')
  , db = new Datastore({ filename: './databases/votesAnswers.db', autoload: true });
  db.persistence.setAutocompactionInterval(1000 * 30);

function updateVa(vote_id, answer_id, login, gests) {
  return new Promise((resolve, reject) => {
    db.update({vote_id, login}, {vote_id, answer_id, login, gests}, {upsert:true}, (err, result) => {
if (err) {
  reject(err);
} else {
  resolve(result);
}
    });
  });
  }

function removeVa(db_id) {
  return new Promise((resolve, reject) => {
    db.remove({_id: db_id}, {}, function (err, numRemoved) {
if (err) {
  reject(err);
} else {
       resolve(numRemoved);
}
    });
  });
  }

  function findVa(vote_id) {
    return new Promise((resolve, reject) => {
    db.find({vote_id}, (err, result) => {
  if (err) {
    reject(err);
  } else {
         resolve(result);
  }
        });
  });
  }

  module.exports.updateVa = updateVa;
module.exports.removeVa = removeVa;
module.exports.findVa = findVa;