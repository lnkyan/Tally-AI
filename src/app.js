// app.js

import path from 'path';
import { fileURLToPath } from 'url';
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

// 启动服务器
const port = 3000;
app.listen(port, () => {
  console.log(`TallyAI API running at http://localhost:${port}`);
});

export default app;