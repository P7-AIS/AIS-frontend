// package: protobuf
// file: ais.proto

import * as ais_pb from "./ais_pb";
import {grpc} from "@improbable-eng/grpc-web";

type AISServiceGetVesselInfo = {
  readonly methodName: string;
  readonly service: typeof AISService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof ais_pb.VesselInfoRequest;
  readonly responseType: typeof ais_pb.VesselInfoResponse;
};

type AISServiceGetVesselPath = {
  readonly methodName: string;
  readonly service: typeof AISService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof ais_pb.VesselPathRequest;
  readonly responseType: typeof ais_pb.VesselPathResponse;
};

type AISServiceStartStreaming = {
  readonly methodName: string;
  readonly service: typeof AISService;
  readonly requestStream: true;
  readonly responseStream: true;
  readonly requestType: typeof ais_pb.StreamingRequest;
  readonly responseType: typeof ais_pb.StreamingResponse;
};

export class AISService {
  static readonly serviceName: string;
  static readonly GetVesselInfo: AISServiceGetVesselInfo;
  static readonly GetVesselPath: AISServiceGetVesselPath;
  static readonly StartStreaming: AISServiceStartStreaming;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class AISServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getVesselInfo(
    requestMessage: ais_pb.VesselInfoRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: ais_pb.VesselInfoResponse|null) => void
  ): UnaryResponse;
  getVesselInfo(
    requestMessage: ais_pb.VesselInfoRequest,
    callback: (error: ServiceError|null, responseMessage: ais_pb.VesselInfoResponse|null) => void
  ): UnaryResponse;
  getVesselPath(
    requestMessage: ais_pb.VesselPathRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: ais_pb.VesselPathResponse|null) => void
  ): UnaryResponse;
  getVesselPath(
    requestMessage: ais_pb.VesselPathRequest,
    callback: (error: ServiceError|null, responseMessage: ais_pb.VesselPathResponse|null) => void
  ): UnaryResponse;
  startStreaming(metadata?: grpc.Metadata): BidirectionalStream<ais_pb.StreamingRequest, ais_pb.StreamingResponse>;
}

