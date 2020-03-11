import * as functions from "firebase-functions";

const axios = require("axios").default;
const sendfoxKey = "Bearer " + functions.config().sendfox.key;

export const addSubscriber = functions.https.onCall(async (data, context) => {
  console.log("CALLABLE: ", data);
  addToSendfox(data);
  return { msg: "You are now subscribed through a callable function!" };
});

exports.newSubscriber = functions.firestore
  .document("subscribers/{id}")
  .onCreate((snap, context) => {
    let user: any = snap.data();
    console.log("firebase document: ", user);
    addToSendfox(user);
    return true;
  });

function addToSendfox(user: any) {
  // Use your Sendfox List ID
  user.lists = [18645];

  console.log("USERDATA: ", user);

  const options = {
    url: "https://api.sendfox.com/contacts",
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: sendfoxKey
    },
    data: user
  };

  axios(options)
    .then((response: any) => {
      console.log("response: ", response);
    })
    .catch((error: any) => {
      console.log("error: ", error);
    });
}
