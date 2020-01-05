browser.runtime.onMessage.addListener(request => {
  let response = ''
  if (request.req === 'source-code') {
    response = document.documentElement.innerHTML
  }
  return Promise.resolve({ content: response })
})
