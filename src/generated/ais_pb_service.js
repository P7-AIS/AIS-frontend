// package: protobuf
// file: ais.proto

var ais_pb = require("./ais_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var AISService = (function () {
  function AISService() {}
  AISService.serviceName = "protobuf.AISService";
  return AISService;
}());

AISService.GetVesselInfo = {
  methodName: "GetVesselInfo",
  service: AISService,
  requestStream: false,
  responseStream: false,
  requestType: ais_pb.VesselInfoRequest,
  responseType: ais_pb.VesselInfoResponse
};

AISService.GetVesselPath = {
  methodName: "GetVesselPath",
  service: AISService,
  requestStream: false,
  responseStream: false,
  requestType: ais_pb.VesselPathRequest,
  responseType: ais_pb.VesselPathResponse
};

AISService.StartStreaming = {
  methodName: "StartStreaming",
  service: AISService,
  requestStream: true,
  responseStream: true,
  requestType: ais_pb.StreamingRequest,
  responseType: ais_pb.StreamingResponse
};

exports.AISService = AISService;

function AISServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

AISServiceClient.prototype.getVesselInfo = function getVesselInfo(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AISService.GetVesselInfo, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AISServiceClient.prototype.getVesselPath = function getVesselPath(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(AISService.GetVesselPath, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

AISServiceClient.prototype.startStreaming = function startStreaming(metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.client(AISService.StartStreaming, {
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport
  });
  client.onEnd(function (status, statusMessage, trailers) {
    listeners.status.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners.end.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners = null;
  });
  client.onMessage(function (message) {
    listeners.data.forEach(function (handler) {
      handler(message);
    })
  });
  client.start(metadata);
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    write: function (requestMessage) {
      client.send(requestMessage);
      return this;
    },
    end: function () {
      client.finishSend();
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

exports.AISServiceClient = AISServiceClient;

