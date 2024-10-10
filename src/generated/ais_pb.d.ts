// package: protobuf
// file: ais.proto

import * as jspb from "google-protobuf";

export class Point extends jspb.Message {
  getLat(): number;
  setLat(value: number): void;

  getLon(): number;
  setLon(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Point.AsObject;
  static toObject(includeInstance: boolean, msg: Point): Point.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Point, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Point;
  static deserializeBinaryFromReader(message: Point, reader: jspb.BinaryReader): Point;
}

export namespace Point {
  export type AsObject = {
    lat: number,
    lon: number,
  }
}

export class Location extends jspb.Message {
  hasPoint(): boolean;
  clearPoint(): void;
  getPoint(): Point | undefined;
  setPoint(value?: Point): void;

  getHeading(): number;
  setHeading(value: number): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Location.AsObject;
  static toObject(includeInstance: boolean, msg: Location): Location.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Location, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Location;
  static deserializeBinaryFromReader(message: Location, reader: jspb.BinaryReader): Location;
}

export namespace Location {
  export type AsObject = {
    point?: Point.AsObject,
    heading: number,
    timestamp: number,
  }
}

export class SimpleVessel extends jspb.Message {
  getMmsi(): number;
  setMmsi(value: number): void;

  hasLocation(): boolean;
  clearLocation(): void;
  getLocation(): Location | undefined;
  setLocation(value?: Location): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SimpleVessel.AsObject;
  static toObject(includeInstance: boolean, msg: SimpleVessel): SimpleVessel.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SimpleVessel, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SimpleVessel;
  static deserializeBinaryFromReader(message: SimpleVessel, reader: jspb.BinaryReader): SimpleVessel;
}

export namespace SimpleVessel {
  export type AsObject = {
    mmsi: number,
    location?: Location.AsObject,
  }
}

export class MonitoredVessel extends jspb.Message {
  getMmsi(): number;
  setMmsi(value: number): void;

  getTrustworthiness(): number;
  setTrustworthiness(value: number): void;

  hasReason(): boolean;
  clearReason(): void;
  getReason(): string;
  setReason(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MonitoredVessel.AsObject;
  static toObject(includeInstance: boolean, msg: MonitoredVessel): MonitoredVessel.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MonitoredVessel, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MonitoredVessel;
  static deserializeBinaryFromReader(message: MonitoredVessel, reader: jspb.BinaryReader): MonitoredVessel;
}

export namespace MonitoredVessel {
  export type AsObject = {
    mmsi: number,
    trustworthiness: number,
    reason: string,
  }
}

export class VesselPathRequest extends jspb.Message {
  getMmsi(): number;
  setMmsi(value: number): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VesselPathRequest.AsObject;
  static toObject(includeInstance: boolean, msg: VesselPathRequest): VesselPathRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VesselPathRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VesselPathRequest;
  static deserializeBinaryFromReader(message: VesselPathRequest, reader: jspb.BinaryReader): VesselPathRequest;
}

export namespace VesselPathRequest {
  export type AsObject = {
    mmsi: number,
    timestamp: number,
  }
}

export class VesselPathResponse extends jspb.Message {
  getMmsi(): number;
  setMmsi(value: number): void;

  clearPathforecastList(): void;
  getPathforecastList(): Array<Location>;
  setPathforecastList(value: Array<Location>): void;
  addPathforecast(value?: Location, index?: number): Location;

  clearPathhistoryList(): void;
  getPathhistoryList(): Array<Location>;
  setPathhistoryList(value: Array<Location>): void;
  addPathhistory(value?: Location, index?: number): Location;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VesselPathResponse.AsObject;
  static toObject(includeInstance: boolean, msg: VesselPathResponse): VesselPathResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VesselPathResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VesselPathResponse;
  static deserializeBinaryFromReader(message: VesselPathResponse, reader: jspb.BinaryReader): VesselPathResponse;
}

export namespace VesselPathResponse {
  export type AsObject = {
    mmsi: number,
    pathforecastList: Array<Location.AsObject>,
    pathhistoryList: Array<Location.AsObject>,
  }
}

export class StreamingRequest extends jspb.Message {
  clearSelectedareaList(): void;
  getSelectedareaList(): Array<Point>;
  setSelectedareaList(value: Array<Point>): void;
  addSelectedarea(value?: Point, index?: number): Point;

  getStarttime(): number;
  setStarttime(value: number): void;

  getTimespeed(): number;
  setTimespeed(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StreamingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StreamingRequest): StreamingRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StreamingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StreamingRequest;
  static deserializeBinaryFromReader(message: StreamingRequest, reader: jspb.BinaryReader): StreamingRequest;
}

export namespace StreamingRequest {
  export type AsObject = {
    selectedareaList: Array<Point.AsObject>,
    starttime: number,
    timespeed: number,
  }
}

export class StreamingResponse extends jspb.Message {
  clearVesselsList(): void;
  getVesselsList(): Array<SimpleVessel>;
  setVesselsList(value: Array<SimpleVessel>): void;
  addVessels(value?: SimpleVessel, index?: number): SimpleVessel;

  clearMonitoredvesselsList(): void;
  getMonitoredvesselsList(): Array<MonitoredVessel>;
  setMonitoredvesselsList(value: Array<MonitoredVessel>): void;
  addMonitoredvessels(value?: MonitoredVessel, index?: number): MonitoredVessel;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StreamingResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StreamingResponse): StreamingResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StreamingResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StreamingResponse;
  static deserializeBinaryFromReader(message: StreamingResponse, reader: jspb.BinaryReader): StreamingResponse;
}

export namespace StreamingResponse {
  export type AsObject = {
    vesselsList: Array<SimpleVessel.AsObject>,
    monitoredvesselsList: Array<MonitoredVessel.AsObject>,
  }
}

export class VesselInfoRequest extends jspb.Message {
  getMmsi(): number;
  setMmsi(value: number): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VesselInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: VesselInfoRequest): VesselInfoRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VesselInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VesselInfoRequest;
  static deserializeBinaryFromReader(message: VesselInfoRequest, reader: jspb.BinaryReader): VesselInfoRequest;
}

export namespace VesselInfoRequest {
  export type AsObject = {
    mmsi: number,
    timestamp: number,
  }
}

export class VesselInfoResponse extends jspb.Message {
  getMmsi(): number;
  setMmsi(value: number): void;

  getName(): string;
  setName(value: string): void;

  hasShiptype(): boolean;
  clearShiptype(): void;
  getShiptype(): string;
  setShiptype(value: string): void;

  hasImo(): boolean;
  clearImo(): void;
  getImo(): number;
  setImo(value: number): void;

  hasCallsign(): boolean;
  clearCallsign(): void;
  getCallsign(): string;
  setCallsign(value: string): void;

  hasFlag(): boolean;
  clearFlag(): void;
  getFlag(): string;
  setFlag(value: string): void;

  hasWidth(): boolean;
  clearWidth(): void;
  getWidth(): number;
  setWidth(value: number): void;

  hasLength(): boolean;
  clearLength(): void;
  getLength(): number;
  setLength(value: number): void;

  hasPositionfixingdevice(): boolean;
  clearPositionfixingdevice(): void;
  getPositionfixingdevice(): string;
  setPositionfixingdevice(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VesselInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: VesselInfoResponse): VesselInfoResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VesselInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VesselInfoResponse;
  static deserializeBinaryFromReader(message: VesselInfoResponse, reader: jspb.BinaryReader): VesselInfoResponse;
}

export namespace VesselInfoResponse {
  export type AsObject = {
    mmsi: number,
    name: string,
    shiptype: string,
    imo: number,
    callsign: string,
    flag: string,
    width: number,
    length: number,
    positionfixingdevice: string,
  }
}

