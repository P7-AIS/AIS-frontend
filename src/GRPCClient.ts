import { AISServiceClientImpl, GrpcWebImpl } from '../proto/AIS-protobuf/ais'

const rpc = new GrpcWebImpl('http://localhost:8787', {})

export default new AISServiceClientImpl(rpc)
