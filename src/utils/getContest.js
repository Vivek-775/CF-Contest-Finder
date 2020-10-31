const request = require('request')

const getContests = (user1, user2, search, callback) => {
  const contestListUrl = `https://codeforces.com/api/contest.list`;
  const userOneUrl = `https://codeforces.com/api/user.rating?handle=${user1}`;
  const userTwoUrl = `https://codeforces.com/api/user.rating?handle=${user2}`;

  let contestList = [];
  let userContests = new Set();

  request({ url: userOneUrl, json: true }, (error, { body }) => {
    if (error) {
      return callback('Unable to connect to the network services :(', undefined);
    } else if (body.status === "FAILED") {
      return callback(body.comment, undefined);
    } else {
      const res = body.result;
      for (let i = 0; i < res.length; i++) {
        let obj = {
          contestId: res[i].contestId,
          contestName: res[i].contestName
        };
        userContests.add(obj);
      }
    }

    request({ url: userTwoUrl, json: true }, (error, { body }) => {
      if (error) {
        return callback('Unable to connect to the network services :(', undefined);
      } else if (body.status === "FAILED") {
        return callback(body.comment, undefined);
      } else {
        const res = body.result;
        for (let i = 0; i < res.length; i++) {
          let obj = {
            contestId: res[i].contestId,
            contestName: res[i].contestName
          };
          userContests.add(obj);
        }
      }

      request({ url: contestListUrl, json: true }, (error, { body }) => {
        if (error) {
          callback('Unable to connect to the network services :(', undefined);
        } else {
          const res = body.result;
          let n = 0;
          for (let i = 0; i < res.length; i++) {
            if (res[i].phase === "FINISHED") {
              var contestType = "Div. " + search;
              if(search === "0" || !search)
              {
                let obj = {
                  contestId: res[i].contestId,
                  contestName: res[i].contestName
                };
                if(!userContests.has(obj))
                {
                    contestList.push({
                      contestId: res[i].id,
                      contestName: res[i].name
                    });
                    n++;
                }
              }
              else
              {
                var contest = JSON.stringify(res[i].name);
                if(contest.includes(contestType))
                {
                  let obj = {
                    contestId: res[i].contestId,
                    contestName: res[i].contestName
                  };
                  if(!userContests.has(obj))
                  {
                      contestList.push({
                        contestId: res[i].id,
                        contestName: res[i].name
                      });
                      n++;
                  }
                }
              }
            }
            if(n === 3)
              break;
          }
        }
        callback(undefined, contestList);
      });
    });
  });
}

module.exports = getContests;



// ================================================== Test Code ==================================================

// getContests('fluffy123', 'rez_', (error, data) => {
//   console.log('Error', error);
//   console.log('Data', data);
// });

// ================================================== Test Code ==================================================