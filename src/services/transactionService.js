import lodash from 'lodash';
import transactionModel from '../models/transactionModel.js';

/**
 * 新增一个记账记录 
 *
 * @param {object} transaction - 记录对象
 * @param {number} transaction.date - 日期 
 * @param {number} transaction.amount - 金额
 * @param {string} transaction.type - 收入或支出
 * @param {string} transaction.category - 类别 
 * @param {boolean} transaction.isCounted - 是否计入统计
 * @param {string} transaction.remark - 备注
 */
async function addTransaction(transaction) {
    return transactionModel.createTransaction(transaction)
}

/**
 * 获取所有记账记录
 * 
 * @returns {object[]} transactions - 记账记录数组
 */
async function listTransactions() {
    return transactionModel.listTransactions();
}

/**
 * 按类型统计总金额
 * 
 * @param {number} start - 起始日期,默认本月1号
 * @param {number} end - 结束日期,默认今天
 * @returns {object[]} transactions - 分类统计的总金额数组
 */
async function groupByType(start, end) {
    const transactions = await transactionModel.listTransactions();
    return lodash.chain(transactions)
        .filter(transaction => transaction.date >= start && transaction.date <= end)
        .groupBy('type')
        .mapValues(transactions =>
            transactions.reduce((total, r) => {
                if (r.isCounted) {
                    total += r.amount;
                }
                return total;
            }, 0)
        )
        .value();
}

export default {
    addTransaction,
    listTransactions,
    groupByType,
}