import openai from './openai.js';
import transactionModel from '../models/transactionModel.js';
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from '../models/transactionConst.js';

/**
 * 和AI对话
 * @param {string} text 用户输入的文字
 * @returns {string} AI回复的文字
 */
async function chatWithAccountAssistant(text) {
    const functionDescriptions = [
        {
            name: 'addIncomeTransaction',
            description: '记录一笔账单',
            parameters: {
                type: 'object',
                properties: {
                    year: { type: 'number', description: '账单日期中的年' },
                    month: { type: 'number', description: '账单日期中的月' },
                    day: { type: 'number', description: '账单日期中的日' },
                    amountYuan: { type: 'number', description: '账单金额，单位是元' },
                    type: { type: 'string', enum: TRANSACTION_TYPES },
                    category: {
                        type: 'string',
                        enum: TRANSACTION_CATEGORIES.map(item => item.name),
                        description: '账单分类'
                    },
                    isCounted: { type: 'boolean', description: '是否计入统计' },
                    remark: { type: 'string', description: '备注' },
                },
                required: ['amountYuan', 'type', 'category', 'remark'],
            },
            function: callAddTransaction,
        },
    ]
    return chat('assistant', '我是一个AI记账助手，我可以记录开销和收入，并分类统计', text, functionDescriptions, 6)
}

/**
 * 和AI对话
 * @returns {string} AI回复的文字
 */
async function chat(systemRole, systemMessage, userMessage, functionDescriptions, maxCall) {
    const messages = [
        { role: systemRole, content: systemMessage },
        { role: 'user', content: userMessage },
    ]

    while (maxCall--) {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages,
            functions: functionDescriptions.map(({ name, description, parameters }) => ({ name, description, parameters })),
            function_call: maxCall === 0 ? 'none' : 'auto'
        });
        const responseData = response.data.choices[0]
        const message = responseData.message
        messages.push(message)

        if (responseData.finish_reason === 'function_call') {
            const fnResult = await callFunction(functionDescriptions, message.function_call.name, message.function_call.arguments, userMessage)
            messages.push({
                role: 'function',
                name: 'addTransaction',
                content: fnResult,
            })
        } else {
            return message.content
        }
    }
}

/**
 * 分发调用各函数
 * @param {string} functionName 函数名
 * @param {string} argsText 序列化后的函数参数对象
 * @param {string} userMessage 用户输入的文字
 * @returns {string} 函数调用结果信息
 */
async function callFunction(functionDescriptions, functionName, argsText, userMessage) {
    console.log('callFunction', functionName, argsText, userMessage)
    const targetFn = functionDescriptions.find(item => item.name === functionName)
    let fnResult
    if (targetFn) {
        fnResult = await targetFn.function(argsText, userMessage)
    } else {
        fnResult = `函数调用出错，没有找到${functionName}函数`
    }
    return fnResult
}

async function callAddTransaction(argsText, userMessage) {
    let { year, month, day, amountYuan, type, category, isCounted = true, remark } = JSON.parse(argsText)

    const today = new Date()
    // AI总是默认为在说21年，这里改为默认在说今年
    if (!userMessage.includes('年')) {
        year = undefined
    } else if (year && year < 100) {
        year += 2000
    }
    today.setFullYear(year || today.getFullYear(), month ? month - 1 : today.getMonth(), day || today.getDate())
    // 使用当前的时分秒，这样添加同一天的记录时，自然就排好序了
    const date = today.getTime()

    const transaction = {
        date,
        amount: Math.round(amountYuan * 100),
        type,
        category,
        isCounted,
        remark,
        src: userMessage
    }
    await transactionModel.createTransaction(transaction)

    return '记账成功'
}

export default {
    chatWithAccountAssistant,
}