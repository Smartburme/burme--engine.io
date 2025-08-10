# Burme Engine 

Burme Engine သည် knowledge base အပေါ်တွင် အခြေခံထားသော AI chatbot project တစ်ခု ဖြစ်သည်။

## Features

- Knowledge sources ကို Markdown ဖိုင်များ (text, image, coder) အလိုက် ခွဲစိတ်ထားသည်။
- မေးခွန်းအမျိုးအစား အလိုက် အဖြေ JS module များဖြင့် အပိုင်းပိုင်း စီမံထားသည်။
- Frontend chat UI (`public/page.html`) နှင့် Backend API server (`server.js`) ပါဝင်သည်။
- ES modules, async/await, modern JavaScript နည်းပညာ အသုံးပြုထားသည်။

# Project Structure 
```
burme-engine/
├── answer/                        # မေးခွန်းအမျိုးအစားအလိုက် အဖြေ JS modules တွေ
│   ├── hello-ans.js               # Hello-related answers
│   ├── sad-ans.js                 # Sadness-related answers
│   └── happy-ans.js               # Happiness-related answers
│
├── knowledge/                    # Knowledge sources Markdown ဖိုင်များ
│   ├── text-knowledge.md          # Text-related source links
│   ├── image-knowledge.md         # Image-related source links
│   └── coder-knowledge.md         # Coding/programming source links
│
├── public/                      # Frontend assets (served statically)
│   ├── page.html                 # Main frontend chat UI page
│   ├── client.js                 # Frontend JavaScript logic (ES module)
│   └── style.css                 # Frontend styles (CSS)
│
├── index.html                   # Loader page (3 seconds delay → redirect to public/page.html)
├── server.js                   # Backend server (Express, API, knowledge & answers loader)
├── package.json                # Node.js dependencies and scripts
└── README.md                   # Project info and instructions

```

## Installation

Node.js (v14+) လိုအပ်သည်။

```bash
npm install

Usage

npm start

Server ရပ်တည်ပြီးနောက် http://localhost:3000/public/page.html ကို browser ဖြင့် ဝင်ကြည့်နိုင်သည်။

License

MIT License
