// app.js

import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';

import routes from './routes.js';

const app = express();

// 静态资源目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, '../public')));

// 解析请求体数据
app.use(bodyParser.json());
// 挂载API路由
app.use(routes);
// 异常处理
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).send(err.message);
});

// 启动服务器
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`TallyAI API running at http://localhost:${port}`);
});

export default app;