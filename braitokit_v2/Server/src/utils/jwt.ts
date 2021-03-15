import { IUser } from "@/models/user";
import * as jwt from "jsonwebtoken";
import configs from "../configs";

type TokenType = {
  user: IUser,
  admin_id: string | undefined,
  store_id: string | undefined,
  company_id: string | undefined,
}

export default new class JWT {
  /**
   * Generate token from user info
   * @param data ..
   * @returns string
   */
  generateToken(data: TokenType): string {
    return jwt.sign(data, configs.SECRET_KEY);
  }

  /**
   * Parse token to user
   * @param token token
   * @returns user
   */
  parseToken(token: string): TokenType {
    try {
      return jwt.verify(token, configs.SECRET_KEY) as TokenType;
    } catch (err) {
      return {} as TokenType;
    }
  }
}();
