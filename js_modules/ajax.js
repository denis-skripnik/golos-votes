let express = require('express');
let app = express();
const helpers = require("./helpers");
const methods = require("./methods");
const votes = require("./votesdb");
const vadb = require("./vadb");
const conf = require('../config.json');

app.get('/golos-votes/', async function (req, res) {
let type = req.query.type; // получили параметр type из url
let id = req.query.permlink; // получили параметр user из url
if (type === 'list') {
    let allVotes = await votes.findVotes();
let data = [];
    for (let oneVote of allVotes) {
data.push({question: oneVote.question, answers: oneVote.answers, permlink: oneVote.permlink, end_date: oneVote.end_date})
}
res.send(data);
} else if (type === 'voteing' && id) {
try {
    let isVote = await votes.getVoteByPermlink(id);
    let data = {};
    if (isVote) {
data.question = isVote.question;
data.answers = isVote.answers;
data.end_date = isVote.end_date;
    }
    res.send(data);
           console.log(data)
} catch (err) {
  console.error(err)
}
} else if (type === 'vote' && id) {
    let results = {};
    let isVote = await votes.getVoteByPermlink(id);
    if (isVote) {
let voteRes = await vadb.findVa(isVote.permlink);
let all_gests = 0;
let gests_str = '';
if (isVote.consider && isVote.consider === 0 || isVote.consider === "0") {
gests_str = 'При расчёте результатов учитывается только личная СГ';
} else if (isVote.consider && isVote.consider === 1 || isVote.consider === "1") {
    gests_str = 'При расчёте результатов учитывается личная + прокси СГ';
} else if (isVote.consider && isVote.consider === 2 || isVote.consider === "2") {
    gests_str = 'При расчёте результатов учёт СГ аналогичен апвотам.';
} else {
    gests_str = 'При расчёте результатов учитывается только личная СГ';
}

let variants = [];
let voters = [];
for (let vote of voteRes) {
all_gests += vote.gests;
if (!variants[vote.answer_id]) {
    variants[vote.answer_id] = vote.gests;
} else {
variants[vote.answer_id] += vote.gests;
}
if (!voters[vote.answer_id]) {
    voters[vote.answer_id] = [];
    voters[vote.answer_id].push({login: vote.login, gests: vote.gests});
} else {
    voters[vote.answer_id].push({login: vote.login, gests: vote.gests});
}
}
let percents = [];
for (let n in variants) {
percents[n] = ((variants[n] / all_gests) * 100).toFixed(2);
}
results.question = isVote.question;
results.end_date = isVote.end_date
results.all_gests = all_gests;
results.type = gests_str;
results.variants = [];
results.voters = [];
    for (let num in percents) {
        voters[num].sort(helpers.compareGests);
        let list_str = '';
        for (let voter of voters[num]) {
            list_str += `<a href="https://dpos.space/profiles/${voter.login}/golos" target="_blank">${voter.login}</a>, `;
            }
            list_str = list_str.replace(/,\s*$/, "");
        results.variants.push({answer: isVote.answers[num], percent: percents[num], gests: variants[num], voters: list_str});
}
    } // isVote.            
res.send(results);
}
});
app.listen(3200, function () {
});