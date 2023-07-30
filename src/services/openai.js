import tunnel from 'tunnel'
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    basePath: process.env.OPENAI_API_BASE_URL
});

// 通过代理访问OpenAI
if (process.env.OPENAI_API_PROXY_HOST && process.env.OPENAI_API_PROXY_PORT) {
    configuration.baseOptions.httpsAgent = tunnel.httpsOverHttp({
        proxy: {
            host: process.env.OPENAI_API_PROXY_HOST,
            port: process.env.OPENAI_API_PROXY_PORT
        },
    });
}
const openai = new OpenAIApi(configuration);

/**
 * 和OpenAI对话
 * 对话使用的模型是gpt系列。效果最好的gpt4比gpt3.5贵15倍
 * @param {[{role:string,content:string}]} messages 消息历史
 * @param {[{name:string, description:string, parameters:Array}]} functions 允许AI调用的函数，如果传空数组，则仅对话
 * @param {number} temperature 取值为0到2之间。0表示准确，2表示脑洞
 * @returns {{messageData:object, finishReason:string}} AI生成的对话数据，和AI结束生成文字的原因
 * @see https://platform.openai.com/docs/api-reference/chat
 */
async function chat(messages, functions, temperature = 0) {
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages,
            temperature,
            functions,
            function_call: functions.length ? 'auto' : 'none'
        });
        const responseData = response.data.choices[0]
        return {
            messageData: responseData.message,
            finishReason: responseData.finish_reason
        }
    } catch (error) {
        errorHandle(error)
    }
}

/**
 * 由OpenAI续写文字
 * 续写使用的模型是davinci等。效果最好的davinci和gpt3.5差不多，但价格贵10倍
 * @param {string} prompt 传给AI的文字，AI会在后面继续生成内容
 * @param {[{name:string, description:string, parameters:Array}]} functions 允许AI调用的函数，如果传空数组，则仅对话
 * @param {number} temperature 取值为0到2之间。0表示准确，2表示脑洞
 * @returns {{messageData:object, finishReason:string}} AI生成的对话数据，和AI结束生成文字的原因
 * @see https://platform.openai.com/docs/api-reference/completions
 */
async function completion(prompt, temperature = 0) {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            temperature,
            max_tokens: 600,
        });
        const responseData = response.data.choices[0]
        return {
            textData: responseData.text,
            finishReason: responseData.finish_reason
        }
    } catch (error) {
        errorHandle(error)
    }
}

function errorHandle(error) {
    if (error.response) {
        if (error.response.data && error.response.data.error) {
            // 这里的错误信息可能含有API Key，不适合抛出去，说不定会被路由丢到前端
            console.error(error.response.data.error)
        }
        throw new Error(`OpenAI API response status: ${error.response.status}`)
    } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        throw error
    }
}

export default {
    chat,
    completion,
};