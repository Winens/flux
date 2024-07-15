const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["./src/server.ts"],
    bundle: true,
    platform: "node",
    outfile: "./dist/server.js",
    tsconfig: "./tsconfig.json", // if you're using TypeScript
    external: ["@grpc/grpc-js", "sharp"], // Exclude native modules
  })
  .catch(() => process.exit(1));
