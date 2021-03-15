import { v4 as uuidv4 } from "uuid";

export default new class UUID {
  /**
   * generateUUID
   * @returns ..
   */
  generateUUID() {
    return uuidv4();
  }
}();
