import "dotenv/config";
import { HordeClient } from "./api/horde_client.js";
let horde_client_config = {
  HORDE_API_KEY: process.env.HORDE_API_KEY,
  HORDE_URL: process.env.HORDE_URL,
}
let horde_client = new HordeClient(horde_client_config);
//console.log(horde_client);

import express, { json } from "express";
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"]
    //origin: ['http://localhost:*', 'http://anotherdomain.com:*'],
  }
});
let models = await horde_client.getModels()
let scribes = await horde_client.getScribes();
const nb_models = 7 // nombre de models à utiliser 

app.use(json());

const PORT = process.env.PORT || 5678;
const __dirname = dirname(fileURLToPath(import.meta.url));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('scribes',scribes)
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
  socket.on('scribes', async(options) => {
    console.log('scribes')
    scribes = await horde_client.getScribes(options);
    //console.log(scribes)
    // scribes = scribes
    // socket.emit('models',stringifyCircularJSON({models: models}))
    socket.emit('scribes',scribes)
  });
  socket.on('models', async(options) => {
    console.log('models')
    models = await horde_client.getModels(options);
   // console.log(models)
    // socket.emit('models',stringifyCircularJSON({models: models}))
    socket.emit('models',models)
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.post("/v1/chat/completions2", async (req, res) => {
  let demande = req.body
  console.log("\n###\n",demande)
  let response = await horde_client.completions(demande);
 
  console.log("\n###\n",response)
  return response
})

app.post("/v1/chat/completions", async (req, res) => {
  //console.log("req", req)
 // console.log(req.body);
  let demande = req.body
  console.log("\nBEST MODEL",  scribes[0].name,scribes[0].models[0], "\n")
  //get the most performant model
  let model = scribes[0].models[0]
  demande.model = model
  demande.models= []
  for (let i = 1; i < nb_models; i++){
    
    demande.models.push(scribes[i].models[0])
  }
  console.log(demande)

  let response = await horde_client.completions(demande);

  console.log("response", response);

  let fake_response = {
    id: "chatcmpl-123",
    object: "chat.completion",
    created: 1677652288,
    model: model,
    command: [],
    thoughts: [],
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: response.text, //"\n\nHello there, how may I assist you today?",
        },
        finish_reason: "stop",
      },
    ],
    usage: {
      prompt_tokens: 9,
      completion_tokens: 12,
      total_tokens: 21,
    },
  };
  //res.json({ status: true, message: "Our node.js app works" });
  res.json(fake_response);
});

app.get("/v1/models", async (req, res) => {
  console.log("req", req.body);
  // let response = await horde_client.getModels(req.body);
  // console.log(response)
  let response = {
    "object": "list",
    "data": [
      {
        "id": "gpt-3.5-turbo",
        "object": "model",
        "created": 1686935002,
        "owned_by": "organization-owner"
      },
      // {
      //   "id": "gpt-4-0314",
      //   "object": "model",
      //   "created": 1686935002,
      //   "owned_by": "organization-owner",
      // },
      // {
      //   "id": "model-id-2",
      //   "object": "model",
      //   "created": 1686935002,
      //   "owned_by": "openai"
      // },
    ],
  }
  res.json(response);
});

app.post("/", async (req, res) => {
  console.log("req", req);
  res.json({ status: true, message: "Our node.js app works" });
});

app.get("/", async (req, res) => {
  //console.log("req", req);
  res.sendFile(join(__dirname, 'index.html'));
  //res.json({ status: true, message: "Our node.js app works" });
});
app.get("*", async (req, res) => {
  console.log("req", req);
  res.json({ status: true, message: "Our node.js app works" });
});

server.listen(PORT, () => console.log(`App listening at port ${PORT}`));

/* OPENAIAPI ROUTES
https://platform.openai.com/docs/api-reference/authentication
curl https://api.openai.com/v1/models 

curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
     "model": "gpt-3.5-turbo",
     "messages": [{"role": "user", "content": "Say this is a test!"}],
     "temperature": 0.7
   }'



Create chat completion
https://platform.openai.com/docs/api-reference/chat/streaming

post https://api.openai.com/v1/chat/completions
required : messages, model
# format input 
https://cookbook.openai.com/examples/how_to_format_inputs_to_chatgpt_models


# Example OpenAI Python library request
MODEL = "gpt-3.5-turbo"
response = openai.ChatCompletion.create(
    model=MODEL,
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Knock knock."},
        {"role": "assistant", "content": "Who's there?"},
        {"role": "user", "content": "Orange."},
    ],
    temperature=0,
)

response


*/

/* STABLE HORDE 

https://stablehorde.net/api/

https://stablehorde.net/api/v2/workers?type=text

*/


const stringifyCircularJSON = obj => {
  const seen = new WeakSet();
  return JSON.stringify(obj, (k, v) => {
    if (v !== null && typeof v === 'object') {
      if (seen.has(v)) return;
      seen.add(v);
    }
    return v;
  });
};