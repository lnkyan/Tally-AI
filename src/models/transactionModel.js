import db from './db.js';

async function createTransaction(transaction) {
    db.get('transactions').push(transaction)
    db.write();
}

async function listTransactions() {
    const result = await db.get('transactions') || [];
    return result
}

export default {
    createTransaction,
    listTransactions,
};