import configs from "@/configs/config";

export const managerCreatedTemplate = (user: Record<string, any>, password: string) => {
  return {
    from: "cloud@braitokit.com",
    to: user.email,
    subject: "[Cloud Braitokit] Store already available",
    html: `
      <p>Hello <b>${user.name}</b>, Your store is active now! </p>
      <p>Login url: <a href="${configs.SITE_URL}/login">${configs.SITE_URL}/login</a></p>
      <p>Email: ${user.email}</p>
      <p>Phone: ${user.phone}</p>
      <p>Password: ${password}</p>
      <br>
      <p>Thanks!</p>
    `,
  };
};
