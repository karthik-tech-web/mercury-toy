/* eslint-disable no-await-in-loop */
const dbService = require('../../system/db/dbService');
const firebaseApi = require('../../system/lib/firebase/index');

const pushnotification = async (bodyParams) => {
    const tokenIdArray = [];
    bodyParams.notification.devices.forEach((device) => {
        tokenIdArray.push(device.pushkey);
    });
    console.log('=========bodyParams======>', bodyParams);
    // const payload = {
    //     // notification: {
    //     //     title: `${bodyParams.notification.sender_display_name} says`,
    //     //     body: bodyParams.notification.content.body,
    //     //     // image: 'https://gigavus.hydrameet.net/assets/assets/image/gigavuslogo_old.png',
    //     //     icon: 'https://gigavus.hydrameet.net/assets/assets/image/gigavuslogo_old.png',
    //     //     color: '#322e82',
    //     //     // tag: 'h',
    //     // },
    //     data: {
    //         eventId: bodyParams.notification.event_id,
    //         roomId: bodyParams.notification.room_id,
    //         senderId: bodyParams.notification.sender,
    //         senderName: bodyParams.notification.sender_display_name,
    //         type: bodyParams.notification.type,
    //         // msgType: (bodyParams.notification.content && bodyParams.notification.content.msgtype) ? bodyParams.notification.content.msgtype,
    //         // bodyMessage: bodyParams.notification.content.body,
    //     },
    //     apns: {
    //         payload: {
    //             aps: {
    //                 contentAvailable: true,
    //             },
    //         },
    //         headers: {
    //             'apns-push-type': 'background',
    //             'apns-priority': '5', // Must be `5` when `contentAvailable` is set to true.
    //             'apns-topic': 'com.gigavus', // bundle identifier
    //         },
    //     },
    // };
    // if (bodyParams.notification.content) {
    //     if (bodyParams.notification.content.msgtype) {
    //         payload.data.msgType = bodyParams.notification.content.msgtype;
    //     }
    //     if (bodyParams.notification.content.body) {
    //         payload.data.bodyMessage = bodyParams.notification.content.body;
    //     }
    // }

    const sendObj = {
        tokens: tokenIdArray,
        data: {
            eventId: bodyParams.notification.event_id,
            roomId: bodyParams.notification.room_id,
            senderId: bodyParams.notification.sender,
            senderName: bodyParams.notification.sender_display_name,
            type: bodyParams.notification.type,
            // msgType: (bodyParams.notification.content && bodyParams.notification.content.msgtype) ? bodyParams.notification.content.msgtype,
            // bodyMessage: bodyParams.notification.content.body,
        },
        // Set Android priority to "high"
        android: {
            priority: 'high',
        },
        // Add APNS (Apple) config
        apns: {
            payload: {
                aps: {
                    contentAvailable: true,
                },
            },
            headers: {
                'apns-push-type': 'background',
                'apns-priority': '5', // Must be `5` when `contentAvailable` is set to true.
                'apns-topic': 'com.gigavus', // bundle identifier
            },
        },
    };
    if (bodyParams.notification.content) {
        if (bodyParams.notification.content.msgtype) {
            sendObj.data.msgType = bodyParams.notification.content.msgtype;
        }
        if (bodyParams.notification.content.body) {
            sendObj.data.bodyMessage = bodyParams.notification.content.body;
        }
    }
    const data = await firebaseApi.pushNotificationSend(sendObj);
    console.log('=========data======>', data);
    if (data && data.failureCount && data.failureCount > 0 && data.results && data.results[0]) {
        console.log('=========data======>', data.results[0].error);
    }
    const insertParams = {
        reqData: [JSON.stringify(bodyParams)],
    };
    console.log('=========insertParams======>', insertParams);
    const add = await dbService.addService('pushNotification', insertParams);
    console.log('=========add======>', add);
    const result = {
        statusCode: 200,
        message: 'data saved succesfully',
        // Output: add,
    };
    return result;
};

module.exports = {
    pushnotification,
};