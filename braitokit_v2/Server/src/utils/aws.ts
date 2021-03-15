import configs from "@/configs";
import AWS from "aws-sdk";
import fs from "fs";

export default new class AwsS3 {
  private s3Object;
  /**
   * constructor
   */
  constructor() {
    this.s3Object = new AWS.S3({
      accessKeyId: configs.AWS.AWS_KEY_ID,
      secretAccessKey: configs.AWS.AWS_ACCESS_KEY,
      region: configs.AWS.AWS_REGION
    });
  }

  public Upload = (file: any, filePath: string, fileSizeExceed = 1.5): Promise<any> => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        // TODO: limit file size
        console.log(file.size);
        console.log(fileSizeExceed);
        const fileName = filePath;
        const fileSize = file.size; // bytes
        if (fileSize / 1000000 > fileSizeExceed) {
          throw "File size exceed";
        }
        const bucketName = configs.AWS.AWS_BUCKET;
        const contentType = file.type;
        const data = fs.readFileSync(file.path);

        const params = {
          Bucket: bucketName,
          Key: fileName,
          Body: data,
          ContentType: contentType,
          ACL: "public-read"
        };

        const res = await this.s3Object.upload(params).promise();

        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  }
};
