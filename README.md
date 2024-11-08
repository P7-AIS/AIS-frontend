![Github banner_new](https://github.com/user-attachments/assets/de893df9-30e6-42b4-a355-09153eef1f5f)

# AIS-frontend

### Prerequisites

- `npm i`
- Install [Protobuf Compiler (protoc)](https://medium.com/@LogeshSakthivel/installing-protobuf-compiler-protoc-536e7770e13b).
- `git submodule update --init --recursive` to update submodules
- `npm run build:protos:(mac/win)`

### Start server

- `npm run dev` (vite + proxy)
  - `npm run dev:simple` (vite)
  - `npm run proxy` (proxy)

### Test

- `npm run test`
- `npm run test:cov` to show coverage
