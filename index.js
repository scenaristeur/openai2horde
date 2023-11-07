import "dotenv/config";
import { HordeClient } from "./api/horde_client.js";
let horde_client_config = {
  HORDE_API_KEY: process.env.HORDE_API_KEY,
  HORDE_URL: process.env.HORDE_URL,
}
let horde_client = new HordeClient(horde_client_config);
//console.log(horde_client);

import express, { json } from "express";

const app = express();

app.use(json());

const PORT = process.env.PORT || 5678;

app.post("/v1/chat/completions", async (req, res) => {
  //console.log("req", req)
  //console.log(req.body);

  let response = await horde_client.completions(req.body);

  console.log("response", response);
  let fake_response = {
    id: "chatcmpl-123",
    object: "chat.completion",
    created: 1677652288,
    model: "gpt-3.5-turbo-0613",
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

app.post("/", async (req, res) => {
  console.log("req", req);
  res.json({ status: true, message: "Our node.js app works" });
});

app.get("/", async (req, res) => {
  console.log("req", req);
  res.json({ status: true, message: "Our node.js app works" });
});

app.listen(PORT, () => console.log(`App listening at port ${PORT}`));

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
