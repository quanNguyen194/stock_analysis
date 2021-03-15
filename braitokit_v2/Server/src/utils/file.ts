/**
 * getFileExtension from fileType
 * @param fileType
 * @returns string
 */
export const getFileExtension = (fileType: string): string | undefined => {
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
