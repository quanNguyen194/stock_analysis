import {IUser} from "@/models/user";

export const forgotPasswordTemplate = (user: IUser, link: string) => {
  return {
    from: "cloud@braitokit.com",
    to: user.email,
    subject: "[Cloud Braitokit] Reset your password",
    html: `
      <p><b>Reset your password</b></p>
      <p>Hello <b>${user.name}</b>, Please click the link bellow to reset your password: </p>
      <p><a href="${link}">${link}</a></p>
    `,
  };
};
