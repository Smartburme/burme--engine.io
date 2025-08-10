# burme--engine 
# Project Structure 
```
knowledge-ai/
index.html # loader only 3 second to page.html
│
├── knowledge/
│   └── sources.md               # Website link တွေကို Markdown ဖိုင်အဖြစ် စုဆောင်းထားတဲ့ ဖိုင်
│
├── answers.js                  # မေးခွန်းပုံစံအလိုက် အဖြေတွေကို static JavaScript object အနေနဲ့ သိမ်းဆည်းထားသော ဖိုင်
│
├── public/
│   ├── page.html               # User interface ပါဝင်တဲ့ frontend webpage (loader animation နဲ့ API ကိုခေါ်တဲ့ UI)
│   ├── client.js               # Frontend JavaScript — API ကို ခေါ်ဆို၊ input/output ကို စီမံထိန်းချုပ်
│   └── style.css               # Loader နဲ့ UI အလှဆင်မှုများအတွက် CSS ဖိုင်
│
├── server.js                   # Backend server —
│                               #  • knowledge base ကို build လုပ်ခြင်း (Markdown ထဲက links တွေကို fetch, extract, embed)
│                               #  • API endpoint တစ်ခု (POST /api/query) ဖြင့် user မေးခွန်းကို တုံ့ပြန်ပေးခြင်း
│
├── knowledge.json              # Backend ကဖန်တီးထားတဲ့ knowledge data နဲ့ embeddings များ သိမ်းဆည်းထားတဲ့ Cache ဖိုင်
├── package.json                # Node.js project dependencies နဲ့ script တွေ ဖော်ပြထားတဲ့ ဖိုင်
└── README.md

```

