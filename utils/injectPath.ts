export default function injectPath(
  targetPath: string,
  _injectPath: string,
  pathname: string
): string {
  if (!pathname.startsWith(targetPath)) {
    return pathname;
  }

  const parts = pathname.split("/").filter((part) => part !== "");

  if (parts.length === 1) {
    // Case where the pathname is just "/profile"
    return `/${parts[0]}/${_injectPath}`;
  }

  // Case where the pathname is "/profile/12345678"
  const [profile, userId] = parts;
  return `/${profile}/${_injectPath}/${userId}`;
}

// Example usages
// console.log(insertOrderHistory("/profile/12345678")); // Output: "/profile/order-history/12345678"
// console.log(insertOrderHistory("/profile")); // Output: "/profile/order-history"
