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
