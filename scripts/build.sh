PROTOS_DIR="./protos"

GO_OUT_DIR="./src/fluxpb/go"
TS_OUT_DIR="./src/fluxpb/ts"

# Generate Go code
protoc -I=$PROTOS_DIR --go_out=$GO_OUT_DIR $PROTOS_DIR/*.proto
# Move generated Go code to the correct directory
mv $GO_OUT_DIR/pb/* $GO_OUT_DIR
rm -rf $GO_OUT_DIR/pb


# Generate TypeScript code
protoc --plugin="$(which protoc-gen-ts_proto)" --ts_proto_out=$TS_OUT_DIR \
--ts_proto_opt=outputServices=grpc-js --ts_proto_opt=esModuleInterop=true -I protos protos/*.proto
