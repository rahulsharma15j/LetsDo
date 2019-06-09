let appConfig = {
  port: "3000",
  allowedCorsOrigin: "*",
  environment: "dev",
  baseUrl: "http://localhost:3000",
  appUrl: "http://localhost:4200",
  apiVersion: "/api/v1",
  key: `eyJhbGciOiJIUzI1NiJ9.eyJwd2QiOiJzdGFjay4yMDE5In0.qdkNKgKcyPP3y8IDVGBbv6IfhjvSTYiY4dwxbTqRF7s`,
  dbUri: `mongodb://node-shop:node-shop@cluster0-shard-00-00-zvxva.mongodb.net:27017,
       cluster0-shard-00-01-zvxva.mongodb.net:27017,cluster0-shard-00-02-zvxva.
        mongodb.net:27017/letsdoaadppa?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`
};

module.exports = appConfig;
