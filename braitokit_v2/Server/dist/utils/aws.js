"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = __importDefault(require("../configs"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const fs_1 = __importDefault(require("fs"));
exports.default = new class AwsS3 {
    /**
     * constructor
     */
    constructor() {
        this.Upload = (file, filePath, fileSizeExceed = 1.5) => {
            // eslint-disable-next-line no-async-promise-executor
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    // TODO: limit file size
                    console.log(file.size);
                    console.log(fileSizeExceed);
                    const fileName = filePath;
                    const fileSize = file.size; // bytes
                    if (fileSize / 1000000 > fileSizeExceed) {
                        throw "File size exceed";
                    }
                    const bucketName = configs_1.default.AWS.AWS_BUCKET;
                    const contentType = file.type;
                    const data = fs_1.default.readFileSync(file.path);
                    const params = {
                        Bucket: bucketName,
                        Key: fileName,
                        Body: data,
                        ContentType: contentType,
                        ACL: "public-read"
                    };
                    const res = yield this.s3Object.upload(params).promise();
                    resolve(res);
                }
                catch (err) {
                    reject(err);
                }
            }));
        };
        this.s3Object = new aws_sdk_1.default.S3({
            accessKeyId: configs_1.default.AWS.AWS_KEY_ID,
            secretAccessKey: configs_1.default.AWS.AWS_ACCESS_KEY,
            region: configs_1.default.AWS.AWS_REGION
        });
    }
};
//# sourceMappingURL=aws.js.map