import { AISServiceClientImpl, GrpcWebImpl } from '../proto/AIS-protobuf/ais'

const rpc = new GrpcWebImpl('http://localhost:8080', {})

export default new AISServiceClientImpl(rpc)
