# banditr
> requests event listener in browser

track all kinds of requests event

## Usage

```js
import banditr from 'banditr'

banditr.addEventListener('fetch', (params) => {
  console.log('fetch', params)
});

banditr.addEventListener('img', (params) => {
  console.log('img', params)
});

banditr.addEventListener('img', (params) => {
  console.log('img2', params)
});


window.fetch('/')
// output:
// fetch {url, body}

;(new Image()).src = '/?a=c'
// output:
// img {url}
// img2 {url}
```

checkout `demo/` folder for details

## Status

- [x] fetch
- [x] xhr
- [x] Image src
- [ ] navigator.sendBeacon

