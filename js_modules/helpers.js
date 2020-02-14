async function sleep(ms) {
    await new Promise(r => setTimeout(r, ms));
    }

    async function unixTime(){
        return parseInt(new Date().getTime()/1000)
        }
    
function compareGests(a, b)
{
	if(a.gests >= b.gests)
	{
		return -1;
	}
	else{
		return 1;
	}
}

async function getRandomInRange(min, max) {
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	async function jsonFileGenerate(pdb, methods, fs) {
        var fs = require('fs');
const conf = require('../config.json');
        let posts_list = [];
let posts = await pdb.findAllPosts();
    if (posts.length > 0) {
        posts.sort(compareDate);
        for (let post of posts) {
                let isVote = await methods.getContent(post.author, post.permlink);
                if (isVote.code === 0) {
                    let end_date = post.end_date;
                    let now_datetime = await unixTime();
                    if (now_datetime <= end_date) {
                let end_datetime = new Date(end_date*1000);
                let view_end_date = end_datetime.toString();
                let transfers = post.transfers;
                let transfers_list = '';
                if (post.transfers && post.transfers.length > 0) {
                    transfers_list += 'Продвинули: ';
                    for (let one_transfer of transfers) {
                        transfers_list += `<a href="https://golos.id/@${one_transfer}" target="_blank">@${one_transfer}</a>, `;
                    }
                    transfers_list = transfers_list.replace(/,\s*$/, "");
                }
                let slid = post.slid;
                let slid_list = '';
                if (post.slid && post.slid.length > 0) {
                    slid_list += 'Задвинули: ';
                    for (let one_slid of slid) {
                    slid_list += `<a href="https://golos.id/@${one_slid}" target="_blank">@${one_slid}</a>, `;
                    }
                    slid_list = slid_list.replace(/,\s*$/, "");
                }
                let url = `@${post.author}/${post.permlink}`;
                if (post.amount >= conf.minimum) {
                    posts_list.push({url, amount: post.amount + ' GBG (+' + post.promoCode_add + ' GBG промокода). ' + transfers_list + '. ' + slid_list, end: view_end_date, curation_rewards_percent: post.curation_rewards_percent})
                } else {
                    posts_list.push({url, amount: post.amount + ' GBG (+' + post.promoCode_add + ' GBG промокода < минимума). ' + transfers_list + '. ' + slid_list, end: view_end_date, curation_rewards_percent: post.curation_rewards_percent})
                                }
            }
        }
        }
    }
let posts_string = JSON.stringify(posts_list);
try {
     const data = fs.writeFileSync('turn.json', posts_string)
     //файл записан успешно
   } catch (err) {
     console.error(err)
   }
}

async function generatePromoCode(length)
{
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

async function isJsonString(str) {
    try {
        let json_array = JSON.parse(str);
    return {approve: true, data: json_array};
    } catch (e) {
        return {approve: false};
    }
}

    module.exports.unixTime = unixTime;
module.exports.sleep = sleep;
module.exports.compareGests = compareGests;
module.exports.getRandomInRange = getRandomInRange;
module.exports.jsonFileGenerate = jsonFileGenerate;
module.exports.generatePromoCode = generatePromoCode;
module.exports.isJsonString = isJsonString;