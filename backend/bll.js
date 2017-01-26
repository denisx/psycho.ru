let fs = require("fs");

let bll = exports;

bll.config = () => {
  return JSON.parse(fs.readFileSync(process.cwd() + "/config.json", "utf8"));
};