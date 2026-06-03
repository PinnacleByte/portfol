// Defense-in-depth guard for URLs that flow into an anchor `href`. Sanity's
// `url` field validates the scheme on input, but a CMS value should never be
// trusted to be http(s) at render time — a `javascript:` href would execute.
// Mirrors the `hasValidImage` prefix-guard used for <Image> sources.
export function isHttpUrl(url?: string): url is string {
  return !!url && /^https?:\/\//i.test(url);
}
