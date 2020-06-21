// initialize Firebase SDK.
const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();

let db = admin.firestore();


// insert inserts data into database.
// public DNS(IPv4): https://us-central1-finding-hidden-dog.cloudfunctions.net/insert
exports.insert = functions.https.onRequest((request, response) => {
  const data = JSON.parse(request.body);

  // add new data into database.
  db.collection('scores')
    .doc()
    .set({
      user_name: data.user_name,
      time_spent: parseFloat(data.time_spent)
    })
})  // end insert.

// get gets top ten score datas from database.
// public DNS(IPv4): https://us-central1-finding-hidden-dog.cloudfunctions.net/get
exports.get = functions.https.onRequest((request, response) => {
  let rankInfo = 'Success!\tRank Info.\n';
  let cnt = 1;

  db.collection('scores')
    .where('time_spent', '>', 0)
    .orderBy('time_spent')
    .limit(10)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        rankInfo += cnt + '. ' + doc.data().user_name + '\t' + doc.data().time_spent + '\n';
        cnt++;
      })
      response.send(rankInfo);
    })
    .catch(err => {
      console.log(err);
    });
})  // end get.
