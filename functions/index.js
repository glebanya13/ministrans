const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp()

const db = admin.firestore()

exports.AddUserRole = functions.auth.user().onCreate(async (authUser) => {

    if (authUser.email) {
        const customClaims = {
            admin: true,
        };
        try {
            var _ = await admin.auth().setCustomUserClaims(authUser.uid, customClaims)


            return db.collection("roles").doc(authUser.uid).set({
                uid: authUser.uid,
                email: authUser.email,
                role: customClaims
            })

        } catch (error) {
            console.log(error)
        }

    }

});

exports.setUserRoles = functions.https.onCall(async (data, context) => {

    if (!context.auth.token.admin) return
    try {
        data.forEach(async (user) => {
            console.log(user)
            var _ = await admin.auth().setCustomUserClaims(user.uid, user.role).then(() => {

                admin.auth().getUser(user.uid)
                    .then((userRecord) => {

                        // See the UserRecord reference doc for the contents of userRecord.
                        console.log('Successfully fetched user data:', userRecord.toJSON());

                        try {
                            return db.collection("roles").doc(user.uid).set({
                                uid: user.uid,
                                role: user.role,
                                email: userRecord.email
                            }, { merge: true });
                            
                        } catch (error) {
                            console.log('Error updating user role:', error);
                        };
                    })
                    .catch(function (error) {
                        console.log('Error fetching user data:', error);
                    });
            })
                .catch(error => {
                    console.log(error);
                });
        });
    } catch (error) {
        console.log(error)
    }
});

// exports.uploadFile = functions.https.onRequest((req, res) => {
//     var form = new formidable.IncomingForm();
//     return new Promise((resolve, reject) => {
//       form.parse(req, function(err, fields, files) {
//         var file = files.fileToUpload;
//         if(!file){
//           reject("no file to upload, please choose a file.");
//           return;
//         }
//         console.info("about to upload file as a json: " + file.type);
//         var filePath = file.path;
//         console.log('File path: ' + filePath);
  
//         var bucket = gcs.bucket('ministrans-60ff9.appspot.com');
//         return bucket.upload(filePath, {
//             destination: file.name
//         }).then(() => {
//           resolve();  // Whole thing completed successfully.
//         }).catch((err) => {
//           reject('Failed to upload: ' + JSON.stringify(err));
//         });
//       });
//     }).then(() => {
//       res.status(200).send('Yay!');
//       return null
//     }).catch(err => {
//       console.error('Error while parsing form: ' + err);
//       res.status(500).send('Error while parsing form: ' + err);
//     });
//   });