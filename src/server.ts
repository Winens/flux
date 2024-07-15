import * as grpc from "@grpc/grpc-js";
import { FluxImageService, FluxImageServer } from "./fluxpb/flux";
import resize from "./resize";

const PORT = 50049;

function startServer() {
  const srv = new grpc.Server();

  const handlers: FluxImageServer = {
    resize,
  };
  srv.addService(FluxImageService, handlers);

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

startServer();
