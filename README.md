# openai2horde

- If you are like me with no GPU and no will to spend many, many €uros or $ to play with llms here is perharps a solution. 
- If you have a GPU and want to earn kudos, helping other, consider becoming a Horde Worker

openai2horde allow you to use openai based tools like Microsoft Autogen, Auto-GPT and so many more in a decentralized way using Db0 Horde https://stablehorde.net/ & https://github.com/Haidra-Org/AI-Horde

The horde is a crowdsourced distributed cluster of Image generation workers and text generation workers. If you like this service, consider joining the horde yourself!

For more information, check the [FAQ](https://github.com/Haidra-Org/AI-Horde/blob/main/FAQ.md). Finally you can also follow the main developer's blog

- become a Horde worker https://github.com/Haidra-Org/AI-Horde-Worker#readme

- see Horde text workers [Scribes](https://stablehorde.net/api/v2/workers?type=text)

- models from the horde : choose Generic, not Novel Adventure https://github.com/koboldai/koboldai-client

# tests

- [X] microsoft/autogen to Horde https://github.com/microsoft/autogen/discussions/596
- [X] ChatDev to Horde https://github.com/OpenBMB/ChatDev
- [X] Flowise see examples/flowise folder https://docs.flowiseai.com/
- [ ] OpenAgents to Horde https://github.com/xlang-ai/OpenAgents & https://www.youtube.com/watch?v=htla3FzJTfg
- [ ] AutoGPT to Horde https://github.com/Significant-Gravitas/AutoGPT WIP
- [X] Autogen : https://github.com/Andyinater/AutoGen_EnhancedAgents 
- [ ] Autogen : XAgent https://github.com/OpenBMB/XAgent https://www.youtube.com/watch?v=X6dna0O6pCw
- [X] Autogen : Ai Scene writer https://github.com/abhilashi/ai-explorations/blob/main/ai_scene_writer.py
- [X] Autogen : Agentcy https://github.com/amadad/agentcy
- [ ] Langchain
- [ ] Obsidian
- [ ] Notion
- [ ] Deepseek coder to Horde  (does not use openai ?) https://www.youtube.com/watch?v=QPBmsgGufXE & https://deepseekcoder.github.io/ & https://github.com/deepseek-ai/deepseek-coder/
- [ ] any other ideas ?


# autogen examples
some tests are in root folder
- https://microsoft.github.io/autogen/docs/Examples/AgentChat

![Alt text](image-1.png)


# with Chatdev
`(venv) ~/dev/ChatDev$ OPENAI_API_BASE=http://127.0.0.1:5678/v1 OPENAI_API_KEY="dummy" python run.py --task "2048 game" --name "2048"`

`OPENAI_API_BASE=http://127.0.0.1:5678/v1 OPENAI_API_KEY="dummy" python run.py --task "a fiscal advisor Microsoft/autogen app that retrieve information from a chromadb populated with the the 'general tax code' available at this url https://www.legifrance.gouv.fr/download/file/pdf/LEGITEXT000006069577.pdf/LEGI " --name "fiscai"`


![Alt text](image-2.png)



# stable horde api

https://github.com/Haidra-Org/AI-Horde/blob/5f0a0b13c96ea70205fcc1b01b380a6e6738047b/horde/apis/v2/kobold.py

![Alt text](image.png)


# get openai2horde
```
git clone https://github.com/scenaristeur/openai2horde.git
cd openai2horde
npm install

```

# add your horde api key
- renamme .env-example to .env
and complete with your horde api key , see https://stablehorde.net/register and https://stablehorde.net/

# start openai2horde
`npm run start`
--> openai2horde is accessed at http://localhost:5678/v1

# run autogen two_agents.py
`python two_agents.py`



# Agentcy
```bash
~/dev/openai2horde/examples/agentcy$ python main.py 
Please enter the brand or company name: Chateau des Robots
Please enter the your goal, brief, or problem statement: Le château des Robots est un tiers-lieu permettant aux familles et aux jeunes développeurs de se familiariser avec l'intelligence artificielle générative, la robotique, les modèles de language et le développement d'applications mobiles avec Vuejs. Le client est français et toute restitution ou livrable qui lui est adressée doit être en français
```



# dev
run `npm run dev`

# todo
- [ ] test multi-agents with postgres https://www.youtube.com/watch?v=JjVvYDPVrAQ&t=3s
- [ ] see guidance https://github.com/guidance-ai/guidance




# with autogpt
.env : OPENAI_API_BASE_URL=http://localhost:5678/v1

Auto-GPT-0.4.7$ ./run.sh -m json_file --speak

All packages are installed.
2023-11-07 14:54:45.995265: I tensorflow/core/platform/cpu_feature_guard.cc:182] This TensorFlow binary is optimized to use available CPU instructions in performance-critical operations.
To enable the following instructions: AVX2 FMA, in other operations, rebuild TensorFlow with the appropriate compiler flags.
Speak Mode:  ENABLED
WARNING:  You do not have access to gpt-3.5-turbo. Setting fast_llm to gpt-3.5-turbo.
WARNING:  You do not have access to gpt-4-0314. Setting smart_llm to gpt-3.5-turbo.
NEWS:  Welcome to Auto-GPT!
NEWS:  
NEWS:  
Welcome to Auto-GPT!  run with '--help' for more information.
Create an AI-Assistant:  input '--manual' to enter manual mode.
  Asking user via keyboard...
I want Auto-GPT to:


# Autogen code execution
https://github.com/microsoft/autogen/blob/5dfbbbdf73f54f0a244bdcd9113755c557c19cc1/website/docs/FAQ.md#why-is-code-not-saved-as-file





# front 
```
npm create vue@latest
```
- https://socket.io/fr/how-to/use-with-vue