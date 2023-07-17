import path from 'path';
import { fileURLToPath } from 'url';
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adapter = new JSONFileSync(path.resolve(__dirname, '../../data/db.json'));

const db = new LowSync(adapter, {
    transactions: []
});

// 根据key读取一个数据，返回的是支持链式调用的数据对象，需要用.value()才能得到实际的值
db.get = function (key) {
    db.read()
    return db.data[key]
}

export default db;