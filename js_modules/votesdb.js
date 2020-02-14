var Datastore = require('nedb')
  , db = new Datastore({ filename: './databases/votes.db', autoload: true });
  db.persistence.setAutocompactionInterval(1000 * 30);

  function getVote(_id) {
    return new Promise((resolve, reject) => {
    db.findOne({_id}, (err, result) => {
  if (err) {
    reject(err);
  } else {
         resolve(result);
  }
        });
  });
  }

  function getVoteByPermlink(permlink) {
    return new Promise((resolve, reject) => {
    db.findOne({permlink}, (err, result) => {
  if (err) {
    reject(err);
  } else {
         resolve(result);
  }
        });
  });
  }

  function addVote(question, answers, permlink, consider, end_date) {
  return new Promise((resolve, reject) => {
  db.insert({question, answers, permlink, consider, end_date}, function (err, newDoc) {
if (err) {
  reject(err);
} else {
  resolve(newDoc);
}
    });
  });
  }

function removeVote(db_id) {
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

function findVotes() {
  return new Promise((resolve, reject) => {
  db.find({}, (err, result) => {
if (err) {
  reject(err);
} else {
       resolve(result);
}
      });
});
}

module.exports.getVote = getVote;
module.exports.getVoteByPermlink = getVoteByPermlink;
module.exports.addVote = addVote;
module.exports.removeVote = removeVote;
module.exports.findVotes = findVotes;