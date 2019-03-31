import ri from '../'

ri.addEventListener('fetch', (params) => {
  console.log('fetch', params)
});

ri.addEventListener('img', (params) => {
  console.log('img', params)
});

ri.addEventListener('img', (params) => {
  console.log('img2', params)
});


window.fetch('/')

;(new Image()).src = '/?a=c'
