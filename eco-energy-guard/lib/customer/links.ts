export function createCustomerManageLink(token: string) {
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  return `${siteUrl}/manage/${token}`;
}
