const grpc = require("@grpc/grpc-js");
const fluxpb_grpc = require("./fluxpb/flux_grpc_pb");

const resize = require("./resize");

const PORT = 51049;

function main() {
  const srv = new grpc.Server();
  srv.addService(fluxpb_grpc.FluxImageService, {
    resize,
  });

  srv.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err != null) {
        return console.error(err);
      }

      console.log(`Flux service started on port :${PORT}`);
    },
  );
}

main();
