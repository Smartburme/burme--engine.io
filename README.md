# burme--engine 
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

