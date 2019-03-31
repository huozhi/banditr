function parseBodyByContentType(body, contentType) {
  if (/application\/json/.test(contentType)) {
    body = JSON.parse(body)
  } else if (/application\/x-www-form-urlencoded/.test(contentType)) {
    body = body.split('&').reduce((r, pair) => {
      const [k, v] = pair.split('=')
      r[k] = decodeURIComponent(v)
      return r
    }, {})
  }
  return body
}

function parseQuery(queryString) {
  return queryString
    .split('&')
    .map(pair => pair.split('='))
    .reduce((query, kv) => {
      if (kv[0] != null) {
        query[kv[0]] = kv[1] || null
      }
      return query
    }, {})
}

function parseUrl(url) {
  let protocol, host = '', path = '/', query = {}
  const sepIndex = url.indexOf('://')
  if (sepIndex > 0) {
    protocol = url.slice(0, sepIndex)
    url = url.slice(sep + 3)
  }
  const pathSepIndex = url.indexOf('/')
  const querySepIndex = url.indexOf('?')
  if (pathSepIndex > 0) {
    host = url.slice(0, pathSepIndex)
  } else {
    host = (querySepIndex > 0) ? url.slice(0, querySepIndex) : url
  }
  
  if (querySepIndex > 0) {
    const queryString = url.slice(querySepIndex + 1)
    query = parseQuery(queryString)
    path = url.slice(host.length, querySepIndex)
  } else {
    path = url.slice(host.length)
  }

  return {
    protocol,
    host,
    path,
    query,
  }
}

function once(fn) {
  let memo, executed = false
  return function(...args) {
    if (!executed) {
      memo = fn.apply(this, ...args)
    }
    executed = true
    return memo
  }
}

export {
  parseBodyByContentType,
  parseUrl,
  once,
}
