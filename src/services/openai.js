import 'dotenv/config';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    basePath: process.env.OPENAI_API_BASE_URL
});

const openai = new OpenAIApi(configuration);

export default openai;