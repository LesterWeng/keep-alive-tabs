import pathToRegexp from 'path-to-regexp'

const cache: any = {}
const cacheLimit = 10000
let cacheCount = 0

function compilePath(path: any, options: any) {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {})

  if (pathCache[path]) return pathCache[path]

  const keys: pathToRegexp.Key[] | undefined = []
  const regexp = pathToRegexp(path, keys, options)
  const result = { regexp, keys }

  if (cacheCount < cacheLimit) {
    pathCache[path] = result
    cacheCount++
  }

  return result
}

/**
 * Public API for matching a URL pathname to a path.
 */
function matchPath(pathname: any, options: any = {}) {
  if (typeof options === 'string') options = { path: options }

  const { path, exact = false, strict = false, sensitive = false } = options

  const paths = [].concat(path)

  return paths.reduce((matched: any, path) => {
    if (matched) return matched
    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive,
    })
    const match = regexp.exec(pathname)

    if (!match) return null

    const [url, ...values] = match
    const isExact = pathname === url

    if (exact && !isExact) return null

    return {
      path, // the path used to match
      url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((memo: any, key: any, index: any) => {
        memo[key.name] = values[index]
        return memo
      }, {}),
    }
  }, null)
}

export default matchPath
