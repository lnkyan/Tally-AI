import Joi from 'joi';

// 账单类型
const TRANSACTION_TYPES = ['收入', '支出']

// 账单分类
const TRANSACTION_CATEGORIES = [
    { name: '工资', describe: '公司发放的月薪或年薪以及奖金收入' },
    { name: '兼职', describe: '兼职工作收入' },
    { name: '投资', describe: '银行利息、股票分红、基金收益' },
    { name: '经营', describe: '个体经营或副业收入' },
    { name: '礼金', describe: '各类礼品和现金礼金' },
    { name: '餐饮', describe: '餐厅、外卖等消费' },
    { name: '购物', describe: '购买衣服、日用品、电器等开支' },
    { name: '日常', describe: '日常生活各类杂项支出，如房租、水电费、话费、医疗、教育等' },
    { name: '出行', describe: '公交地铁、打车、火车机票等出行支出' },
    { name: '娱乐', describe: '电影、KTV、游乐场等娱乐消费' },
    { name: '其他', describe: '其他分类' }
]

// 账单数据结构规范
const transactionSchema = Joi.object({
    date: Joi.number().required(),
    amount: Joi.number().required(),
    type: Joi.string().valid(...TRANSACTION_TYPES).required(),
    category: Joi.string().valid(...TRANSACTION_CATEGORIES.map(item => item.name)).required(),
    remark: Joi.string().required(),
    src: Joi.string(),
});

export {
    transactionSchema,
    TRANSACTION_TYPES,
    TRANSACTION_CATEGORIES,
};