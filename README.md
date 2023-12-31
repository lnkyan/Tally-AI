# Tally-AI
一个使用自然语言的个人账目管理应用

## 介绍
Tally-AI是一个利用chatGPT[函数调用](https://platform.openai.com/docs/guides/gpt/function-calling)功能实现的个人账目管理小助手。它可以让你用自然语言记录日常收入和支出，并自动进行分类和账目统计。  
该项目代码80%是由[Claude 2](https://claude.ai/)生成出来。调试和前端UI调整由人工完成

### 主要功能
- 使用自然语言记账
- 支持语音输入
- 支持收入和支出记账
- 自动分类账目
- 账目数据统计(收入、支出总金额及分类金额)
- 账目数据展示(表格和图表)

### Demo
![demo](https://raw.githubusercontent.com/lnkyan/Tally-AI/master/public/demo.jpg)


## 快速开始
### 依赖环境
- Node.js v16+
- NPM 6+
- OpenAI的API Key，支持使用`gpt-3.5-turbo`模型

### 安装
```
npm install
```

### 配置
复制`.env.example`文件为`.env`文件，并配置OpenAI API Key等信息。其中`OPENAI_API_KEY`是必填项。  
```
OPENAI_API_KEY = sk-****************************
OPENAI_API_BASE_URL = https://api.openai.com/v1
OPENAI_API_PROXY_HOST = localhost
OPENAI_API_PROXY_PORT = 1080
PORT = 3000
```
也可以直接把这些变量配置为环境变量

### 运行
```
npm start
```
服务运行在 [http://localhost:3000](http://localhost:3000)

### 使用说明
打开[http://localhost:3000](http://localhost:3000)，输入自然语言文本，记录日常收入和支出。例如:
```
今天吃饭花了15元
```
账目数据会自动记录和分类。可以在页面查看账目数据表格和分类统计图表。


## 项目结构
```
├── data              数据库目录
├── public            静态资源目录
└── src               源码目录
    ├── controllers   控制器层 
    ├── services      业务层
    └── models        数据层
```


## 许可
该项目使用 MIT 许可证，详情见`LICENSE`文件。


## 经验总结
- Claude 2 确实有GPT4的水平，连续对话几十条后，仍然能够清楚记得讨论过的所有源码，并且记住的是多次修改后的最新版。向它提出修改意见时完全不需要把它当作某种程序，正常人能听明白的话它都能听明白。
- AI生成的代码会倾向直接堆在一个文件里，不太考虑架构设计。但只要一句话，它就能又好又快得完成模块提取，并修改关联代码。因此利用AI来学习和理解架构问题非常方便。所有问题它都能给出不错的答案，并且能够用当前正在讨论中的项目举例，很容易理解
- 虽然Claude 2的训练数据包含2023年的，但在互联网上一般老版本三方库的资料会比新版本的多。所以训练出的AI会容易写出老版本代码。特别是UI库这种变化频繁的，在当下有些代码已经无法运行了，要求它改用新版本的话代码的正确率就会大幅下降了。因此**AI更适合生成偏后端的代码**
- chatGPT的函数调用功能可以把常规的输入框+按钮式的交互转化为聊天的形态。但它毕竟是一个语言模型，在生成日期、金额等数值型的参数时，特别容易出现错误。比如当用户输入“昨天”时，ChatGPT可能会在`year`参数上生成一个2021；而对于一笔“2元”的消费，它又可能在以分为单位的`amount`参数上生成一个`-2`。**对于语言模型来说，它特别难以理解`现在`的概念**。同时我们需要尽量避免由模型来计算。比如把`amount`参数改为以元为单位的`amountYuan`，在得到AI生成的参数后，由自己的代码计算为分
- 在本项目中，`aiService`模块会通过AI生成各种函数调用，而AI生成的数据格式千奇百怪，必须做大量的校验与纠正。纠正完成后再由`aiService`调用其它的service或直接调用model层的各服务。这些工作属于输入数据处理和路由分发，很像是controller层的职责，但现在都在service层。还需要有改进的方案。