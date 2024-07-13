// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var flux_pb = require('./flux_pb.js');

function serialize_flux_ResizeRequest(arg) {
  if (!(arg instanceof flux_pb.ResizeRequest)) {
    throw new Error('Expected argument of type flux.ResizeRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_flux_ResizeRequest(buffer_arg) {
  return flux_pb.ResizeRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_flux_ResizeResponse(arg) {
  if (!(arg instanceof flux_pb.ResizeResponse)) {
    throw new Error('Expected argument of type flux.ResizeResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_flux_ResizeResponse(buffer_arg) {
  return flux_pb.ResizeResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var FluxImageService = exports.FluxImageService = {
  resize: {
    path: '/flux.FluxImage/Resize',
    requestStream: false,
    responseStream: false,
    requestType: flux_pb.ResizeRequest,
    responseType: flux_pb.ResizeResponse,
    requestSerialize: serialize_flux_ResizeRequest,
    requestDeserialize: deserialize_flux_ResizeRequest,
    responseSerialize: serialize_flux_ResizeResponse,
    responseDeserialize: deserialize_flux_ResizeResponse,
  },
};

exports.FluxImageClient = grpc.makeGenericClientConstructor(FluxImageService);
