import admin from "firebase-admin";

interface ISendFcmTopicParams {
  topic: any,
  notification: {
    title: string,
    body: string
  }
}

/**
 * Fcm
 */
export default class Fcm {
  private static _instance: Fcm = new Fcm();

  /**
   * constructor
   */
  constructor() {
    if(Fcm._instance != null){
      throw new Error("Error: Can't instance a singleton");
    }
  }

  /**
   * instance
   * @returns Fcm
   */
  public static get instance(): Fcm
  {
    return Fcm._instance;
  }

  /**
   * sendToTopic
   * @param params
   * @returns Promise<void>
   */
  public async sendToTopic(params: ISendFcmTopicParams): Promise<void> {
    let topicCondition = params.topic;
    if(params.topic.length) {
      topicCondition = `'${params.topic.join("' in topics || '")}' in topics`;
    }
    console.log("Send FCM to topic: ", topicCondition);

    try {
      const res = await admin.messaging().send({
        condition: topicCondition,
        notification: params.notification
      });
      console.info("Send FCM Successfully:", res);
    } catch(e) {
      console.error("Send FCM Failure: ", e);
    }
  }
}
