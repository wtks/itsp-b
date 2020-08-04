# Citemap(仮)

***乗るべき巨人の肩を探そう***

## ローカル環境
+ docker
+ docker-compose
+ npm

が必要

### ビルド
```shell
npm i
cd frontend/
npm i
cd ..
./server.sh build
```

### 起動
`docker-compose up -d`
+ http://localhost:8080/ でサーバーにアクセスできる

### 再起動
`docker-compose restart`

### 削除
`docker-compose down -v`
