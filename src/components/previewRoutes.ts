const globalChromeDisabledPrefixes = [
  "/preview-onixbit-site",
  "/preview-onixbit-home-final",
] as const;

export function shouldHideGlobalChrome(pathname: string | null | undefined) {
  if (!pathname) return false;

  return globalChromeDisabledPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
