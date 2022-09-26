const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({ timestampsInSnapshots: true });

exports.checkPasswordsEveryMinute = functions.pubsub
    .schedule("* * * * *")
    .onRun(async () => {
        // Get all passwords
        const passwords = await admin.firestore().collection("passwords").get();

        // Delete all passwords where now > createdAtInSec + validUntilInSec
        passwords.forEach((password) => {
            const obj = password.data();
            const validInSec = obj.validInSec;
            const createdAtInSec = password.createTime.seconds;

            // Add validInSec to createdAtInSec
            const validUntilInSec = createdAtInSec + validInSec;
            const currentTimeInSec = Math.floor(Date.now() / 1000);

            console.log(
                `Password ${password.id} should be valid until: ${validUntilInSec}. Currently it is: ${currentTimeInSec}`
            );

            // Check if validUntilInSec is more than current time
            if (currentTimeInSec > validUntilInSec) {
                console.log("Deleting password: " + password.id);
                password.ref.delete();
            }
        });

        return null;
    });
