import axios from 'axios'

export const postToRdltr = (url, endpoint, data, config) =>
  axios
    .create({
      baseURL: `https://${url}/api`,
    })
    .post(endpoint, data, config)

export const handleError = (
  err,
  msg = 'Error. Please try again or contact the administrator.'
) => {
  return err.response
    ? err.response.data.message
      ? err.response.data.message
      : msg
    : err.message
    ? err.message
    : msg
}

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Work_with_the_Bookmarks_API
export const isSupportedProtocol = urlString => {
  const supportedProtocols = ['https:', 'http:']
  const url = document.createElement('a')
  url.href = urlString
  return supportedProtocols.indexOf(url.protocol) !== -1
}
