
.PHONY: all
all: clean go ts

# Generate Go code
.PHONY: go
go:
	mkdir -p gen/go
	protoc -I=. --go_out="./gen/go" --go_opt=paths=source_relative *.proto

# Generate TypeScript code
.PHONY: ts
ts:
	mkdir -p gen/ts
	protoc --plugin="$(which protoc-gen-ts_proto)" --ts_proto_out="./gen/ts" -I=. \
		--ts_proto_opt=outputServices=grpc-js --ts_proto_opt=esModuleInterop=true *.proto

clean:
	rm -rf gen/go/*.go gen/ts/*.ts