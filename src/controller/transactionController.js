import express from 'express';
import { transactionSchema } from '../models/transactionConst.js';
import transactionService from '../services/transactionService.js'
import aiService from '../services/aiService.js'

const router = express.Router();

/**
 * 获取所有记账记录
 * 
 * @route GET /transaction/list
 * @returns {object[]} transactions - 记账记录数组
 */
async function listTransactions(req, res, next) {
    try {
        const transactions = await transactionService.listTransactions()

        transactions.sort((a, b) => b.date - a.date)

        res.json(transactions);
    } catch (e) {
        next(e)
    }
}

/**
 * 新增一个记账记录 
 *
 * @route POST /transaction/add
 * @param {object} req.body - 记录对象
 * @returns {string} ok
 */
async function addTransaction(req, res, next) {
    const transaction = req.body;

    // 参数验证
    const { error } = transactionSchema.validate(transaction);
    if (error) {
        next(error)
        return
    }

    try {
        await transactionService.addTransaction(transaction);
    } catch (e) {
        next(e)
    }

    res.send('ok');
}

/**
 * 通过自然语言新增一个记账记录 
 *
 * @param {string} req.body.text - 自然语言字符串
 * @returns {string} AI回复的内容
 */
async function addTransactionAi(req, res, next) {
    try {
        const result = await aiService.chatWithAccountAssistant(req.body.text)
        res.send(result || 'ok');
    } catch (e) {
        next(e)
    }
}

/**
 * 按类型统计总金额
 * 
 * @param {number} start.query - 起始日期,默认本月1号
 * @param {number} end.query - 结束日期,默认今天
 */
async function groupByType(req, res, next) {
    try {
        const firstDay = new Date(Date.now())
        firstDay.setDate(1);
        firstDay.setHours(0, 0, 0, 0);

        const start = parseInt(req.query.start) || firstDay.getTime();
        const end = parseInt(req.query.end) || Date.now();

        const results = await transactionService.groupByType(start, end)

        res.json(results);
    } catch (e) {
        next(e)
    }
}

// Router 定义
router.get('/list', listTransactions);
router.post('/add', addTransaction);
router.post('/add_ai', addTransactionAi);
router.get('/groupByType', groupByType);

export default router;