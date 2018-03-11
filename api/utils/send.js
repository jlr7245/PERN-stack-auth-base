module.exports = (req, res) => {
  const { status, data } = res.locals
  res.status(status || 200).json(data)
}
