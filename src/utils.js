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
