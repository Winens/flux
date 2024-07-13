const fluxpb = require("./fluxpb/flux_pb");
const sharp = require("sharp");

function resize(call, callback) {
  let res = new fluxpb.ResizeResponse();
  res.setImageData(new Buffer(1, 2, 3, 4, 5, 6, 7, 8));

  callback(null, res);
}

module.exports = resize;
