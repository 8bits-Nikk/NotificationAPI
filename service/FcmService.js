import admin from 'firebase-admin'
import serviceAccount from '../key/serviceAccount.js'

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const fcmService = async (docId, message) => {
    let registrationTokens = []

    const userTokens = await admin.firestore()
        .collection('users')
        .doc(docId)
        .get()

    registrationTokens = userTokens.data().tokens

    const messageBody = {
        tokens: registrationTokens,
        data: {
            title: message.title,
            body: message.body,
            img: message.img,
        },
    }
    if (registrationTokens.length != 0) {
        await admin.messaging().sendMulticast(messageBody)
            .then(response => {
                console.log('Successfully sent message:', response);
            })
            .catch(error => {
                console.log('Error sending message:', error);
            });
    } else {
        console.log('No device login');
    }
}

export default fcmService