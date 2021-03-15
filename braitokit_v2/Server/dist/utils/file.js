"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileExtension = void 0;
/**
 * getFileExtension from fileType
 * @param fileType
 * @returns string
 */
const getFileExtension = (fileType) => {
    switch (fileType.toLowerCase()) {
        case "image/jpeg": {
            return "jpeg";
        }
        case "image/jpg": {
            return "jpg";
        }
        case "image/png": {
            return "png";
        }
        case "audio/x-aac": {
            return "aac";
        }
        case "audio/mp3": {
            return "mp3";
        }
        default: {
            return undefined;
        }
    }
};
exports.getFileExtension = getFileExtension;
//# sourceMappingURL=file.js.map