exports.render = (req, res) => {
  require("../../mail").send();
  res.end();
}