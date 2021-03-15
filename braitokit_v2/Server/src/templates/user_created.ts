import configs from "@/configs/config";
import {IUser} from "@/models/user";

export const userCreatedTemplate = (user: IUser, password: string) => {
  return {
    from: "cloud@braitokit.com",
    to: user.email,
    subject: "[Cloud Braitokit] your account was created",
    html: `
      <p><b>Created Account</b></p>
      <p>Hello <b>${user.name}</b>, Your account is active now! </p>
      <p>Login url: <a href="${configs.SITE_URL}/login">${configs.SITE_URL}/login</a></p>
      <p>Email: ${user.email}</p>
      <p>Phone: ${user.phone}</p>
      <p>Password: ${password}</p>
      <br>
      <p>Thanks!</p>
    `,
  };
};
