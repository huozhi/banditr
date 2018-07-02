import url from 'url'

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

class Interception {
  constructor() {
    this._xhrInterceptors = []
    this._imageInterceptors = []
    this._fetchInterceptors = []
  }

  setup() {
    this._setupXHR()
    this._setupImage()
    this._setupFetch()
  }

  _setupImage() {
    const handlers = this._imageInterceptors
    const nativeImageProto = window.Image.prototype
    const nativeImageSrcDescriptor = Object.getOwnPropertyDescriptor(nativeImageProto, 'src')

    const getUrlParams = value => {
      const parsedUrl = url.parse(value, true)
      const params = {
        url: parsedUrl.host + parsedUrl.path,
        query: parsedUrl.query,
      }
      Interception.safeCallHandlers(handlers)(params)
    }

    const originSrcSetProto = nativeImageSrcDescriptor.set

    const descriptor = Object.assign(nativeImageSrcDescriptor, {
      set: function(value) {
        getUrlParams(value)
        return originSrcSetProto.call(this, value)
      },
    })

    Object.defineProperty(nativeImageProto, 'src', descriptor)
  }

  _setupXHR() {
    const xhrProto = XMLHttpRequest.prototype
    const originOpen = xhrProto.open
    const originSend = xhrProto.send
    const originSetHeader = xhrProto.setRequestHeader
    const handlers = this._xhrInterceptors

    xhrProto.setRequestHeader = function(header, value) {
      const name = header.toLocaleLowerCase()
      if (name === 'content-type') {
        this._contentType = value
      }
      return originSetHeader.call(this, header, value)
    }

    xhrProto.open = function(method, url, async, u, p) {
      this._requestURL = url
      this._method = method
      return originOpen.call(this, method, url, true, u, p)
    }

    xhrProto.send = function(body) {
      const params = {
        url: this._requestURL,
        body: parseBodyByContentType(body, this._contentType),
      }
      Interception.safeCallHandlers(handlers)(params)
      return originSend.call(this, body)
    }
  }

  _setupFetch() {
    const originFetch = window.fetch
    const handlers = this._fetchInterceptors

    window.fetch = function(url, opts = {}) {
      opts.headers = opts.headers || {}
      const contentType = Object.keys(opts.headers).find(key => key.toLowerCase() === 'content-type')
      const body = parseBodyByContentType(opts.body, opts.headers[contentType])
      const params = {url, body}
      Interception.safeCallHandlers(handlers)(params)
      return originFetch.call(this, url, opts)
    }
  }

  addEventListener(type, fn) {
    if (type === 'xhr') {
      this._xhrInterceptors.push(fn)
    } else if (type === 'img') {
      this._imageInterceptors.push(fn)
    } else if (type === 'fetch') {
      this._fetchInterceptors.push(fn)
    }
  }

  static safeCallHandlers(array) {
    return (...args) => {
      array.forEach(fn => {
        try {
          fn(...args)
        } catch (_) {}
      })
    }
  }
}

export default new Interception()
