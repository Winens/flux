PROTOS_DIR="./protos"

GO_OUT_DIR="./src/fluxpb/go"
TS_OUT_DIR="./src/fluxpb/ts"

# Generate Go code
protoc -I=. --go_out="./gen/go" --go_opt=paths=source_relative *.proto


# Generate TypeScript code
protoc --plugin="$(which protoc-gen-ts_proto)" --ts_proto_out="./gen/ts" -I=. \
--ts_proto_opt=outputServices=grpc-js --ts_proto_opt=esModuleInterop=true *.proto
