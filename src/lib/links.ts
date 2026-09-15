/** Absolute http(s) URLs point off-site; anything else is a path on this site. */
export function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}
