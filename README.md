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
- https://vuetifyjs.com/en/components/data-tables/basics/#selection


# Todo
- should replace model selection by worker.id selection


prompt 
[
  {
    role: 'system',
    content: `Tu es un assistant intelligent, qui représente un "LIVREDONT VOUS ETES LE HEROS3, un livre co-écrit avec l'utilisateur, tu racontes une histoire cohérente, fantastique.`
  },
  {
    role: 'user',
    content: "Je pouvais entendre le bruit des pas d'Adrienne avant de la voir. Il y avait une certaine cadence dans la façon dont Adrienne marchait qui la distinguait de la plupart des femmes ; l'inclinaison spécifique de son orteil, le bruissement de sa jupe, le balancement de ses hanches, un mélange de confiance sans hâte et d'invitation subtile. Cela me faisait reprendre mon souffle à chaque fois que je l'entendais. À certains égards, mais pas beaucoup, elle me faisait penser à une panthère exotique. Un chat agile de la jungle. Il était impossible de ne pas lever les yeux lorsque je sentais sa présence proche.\n" +
      "J'ai rencontré son visage, trouvant ses yeux perçants qui, dans le passé, avaient fait détourner la plupart des hommes d'elle. Son visage s'étendait sur les hautes arches de ses pommettes qui auraient pu tenir entre les mains d'un maître d'œuvre. Ses joues rougissaient comme celles d'une écolière et ses lèvres avaient le baiser de porcelaine vierge d'une jeune religieuse. Elle passa ses doigts dans mes cheveux, tirant doucement sur les mèches. Son contact était léger mais ferme et cela me fit frissonner le dos. \n" +
      '"Vous me demandez un rendez-vous et vous ne vous brossez même pas les cheveux ?" Dit-elle. \n' +
      `"Pas même un bonjour ?" Je réponds en arrangeant mes cheveux, "Et je l'ai fait. Ça ressemble à ça."\n` +
      "Elle a haussé les sourcils et m'a jeté un regard de côté tout en repoussant un quelques cheveux épars qui tombaient sur son front. Faisant une pause, Adrienne détourna son regard de moi avant que ses yeux ne se tournent nerveusement vers sa tenue alors qu'elle ajustait sa chemise et sa veste. Une fois de plus, sa gêne inhabituelle avait trahi son désintérêt.\n" +
      `"Je sais ce que tu ressens. Avant, j'étais pareil," remarquai-je. \n` +
      `"Hein ?" Adrienne m'a regardé, ajustant rapidement une mèche de ses cheveux. "Qu'est-ce que tu veux dire ?"\n` +
      `"Je m'inquiète de mon apparence devant les gens que je voulais impressionner."\n` +
      'Adrienne croisa les bras. "Je vais à un rendez-vous seulement pour te faire taire," souffla-t-elle. Ses joues roses racontaient une autre histoire.\n' +
      `"Je pense que j'ai gagné un peu de respect ici", la taquinai-je.\n` +
      `"Tu ne vas pas m'en dissuader", a déclaré Adrienne. , "Nous avons un rendez-vous alors tu me laisses tranquille."\n` +
      `J'ai ri. "Et alors ? On va au café ?"\n` +
      '"Ouais, on pourrait aussi bien," concéda-t-elle.\n' +
      "Adrienne m'a attrapé le bras et m'a tiré hors du bord de la route, me réprimandant pour debout près du trottoir au cas où une voiture passerait à côté de nous. Ses douces réprimandes m'ont rappelé une grande sœur. Nous avons marché sur le trottoir, Adrienne en tête, bavardant pendant que je la suivais. Elle tenait la tête haute, le dos droit et les bras balancés le long du corps avec assurance et détermination. Chacune de ses actions témoignait de sa fierté, mais en même temps, elle était timide. Adrienne était une contradiction ambulante. \n" +
      '"Tu es de bonne humeur," je souris.\n' +
      `Adrienne me lança un regard en coin. "Je ne le suis pas", dit-elle en se ponctuant d'une moue.\n` +
      `Le café était un petit endroit pittoresque avec une atmosphère chaleureuse. Malgré cela, il y avait une longue file d’attente à la porte. J'ai vérifié ma montre et j'ai vu qu'il était à peine plus de midi. C'était étrange qu'ils soient si occupés si tôt dans la journée. Adrienne hésita, regardant autour d'elle avant de se rapprocher timidement de moi. "Qu'est-ce qui ne va pas ?" J'ai demandé.\n` +
      `"Peut-être qu'on devrait revenir plus tard quand il y aura moins de monde", a dit Adrienne.",`
  }
]

reponse 
{
  index: 0,
  message: {
    role: 'assistant',
    content: '"Patience, on y arrivera tôt ou tard."\n' +
      "Elle a soupiré mais a finalement accepté. Nous nous sommes mis à attendre dans la file d'attente, je derrière elle, mes mains dans les poches, mon regard errant sur ses cheveux bruns lissés qui frôlaient sa nuque, sur son dos droit et ses hanches en mouvement, sur ses épaules larges et bien dessinées. Elle sentait bon, une odeur de vanille et de fleurs sauvages. J'ai essayé de me concentrer sur notre conversation pour ne pas penser à tout ça."
  },
  finish_reason: 'stop'
}
