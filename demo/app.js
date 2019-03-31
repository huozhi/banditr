import {RequestInterception as ri} from '../'

ri.setup()

ri.addEventListener('fetch', (params) => {
  console.log('fetch', params)
});

ri.addEventListener('img', (params) => {
  console.log('img', params)
});


window.fetch('/')

;(new Image()).src = '/?a=c'
