import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export class HordeClient {
  constructor(options = {}) {
    this.options = options;
    this.horde_url = options.HORDE_URL || "https://aihorde.net/api/v2/";
    this.horde_url_rescue =
      options.HORDE_URL_RESCUE || "https://horde.koboldai.net/api/v2/";
    this.client_agent =
      options.HORDE_CLIENT_AGENT ||
      "openai2horde:1.1.0:github.com/scenaristeur/openai2horde";
    this.horde_api_key = options.HORDE_API_KEY || "0000000000";
    this.langues = { fr: "french", en: "english" };
    this.params = {
      n: 1,
      max_context_length: 2048,
      max_length: 200,
      rep_pen: 1.1,
      temperature: 0.7,
      top_p: 0.92,
      top_k: 0,
      top_a: 0,
      typical: 1,
      tfs: 1,
      rep_pen_range: 320,
      rep_pen_slope: 0.7,
      sampler_order: [6, 0, 1, 3, 4, 2, 5],
      use_default_badwordsids: false,
      stop: [".", "[INST]"],
    };
    this.models = [
      // aphrodite/Sao10K/Stheno-1.8-L2-13B // français cohérent et concis
      // "3080 | KoboldAI-GPTQ Exllama | x.com/justthirst1",  // llama
      // "KoboldAI/LLaMA2-13B-Holomax"                        //llama 2
      // "koboldcpp/MythoMax-L2-13b"
      //"aphrodite/Undi95/Emerhyst-20B"
      //"koboldcpp/MLewd-ReMM-L2-Chat-20B"
      //'koboldcpp/Mistral-11B-Airoboros-RP-v1.q8_0'
      // "aphrodite/PygmalionAI/mythalion-13b"
      //"aphrodite/TheBloke/MythoMax-L2-13B-AWQ"
      // "Gryphe/MythoMax-L2-13b",
      // "koboldcpp/MythoMax-L2-13b"
    ];
    this.imgen_params = {
      n: 1,
      width: 64 * 8,
      height: 64 * 8,
      steps: 20,
      sampler_name: "k_euler_a",
      cfg_scale: 7.5,
      denoising_strength: 0.6,
    };
    this.workers = [];
    console.log("HORDE CLIENT READY");
  }

  async completions(params) {
    let client = this;
    let result = { comment: "THE GOOD RESULT" };
    console.log("ask for completions with params ", params);

    //     let system_prompt = `
    // Your response should be in json following this format :
    //   "message": {
    //   "role": "assistant",
    //   "content": "{RESPONSE}",
    // }`;

    //     let prompt = system_prompt + "CONTEXT:" + JSON.stringify(params.messages);
    //     console.log("Prompt", prompt);

    let prompt = JSON.stringify(params.messages);

    let llm_request_message = {
      prompt: prompt,
      params: this.params,
      models: this.models,
      workers: this.workers,
    };
    const headers = {
      Accept: "application/json",
      apikey: this.horde_api_key,
      "Client-Agent": this.client_agent,
      "Content-Type": "application/json",
    };
    //console.log('headers', headers)
    result.start = Date.now();

    let response = await axios({
      method: "post",
      url: this.horde_url + "generate/text/async",
      data: llm_request_message,
      headers: headers,
    });
    console.log(/*response, */ response.data);

    let check = await axios({
      method: "get",
      url: this.horde_url + "generate/text/status/" + response.data.id,
      // data: message,
      headers: headers,
    });

    let textPromise = new Promise((resolve, reject) => {
      let timer = setInterval(async function () {
        let check = await axios({
          method: "get",
          url: client.horde_url + "generate/text/status/" + response.data.id,
          headers: headers,
        });

        if (check.data.done == true) {
          result.end = Date.now();
          let text =
            check.data.generations[0] && check.data.generations[0].text;

          console.log("----- text generated : ", text, "\n-----\n");
          clearInterval(timer); // Stop the timer
          resolve(text); // Résoudre la promesse avec le texte
        } else {
          console.log(check.data);
        }
      }, 1000);
    });

    const text = await textPromise; // Attendre que la promesse soit résolue
    result.text = text;
    console.log("RETURN RESULT", result);
    return result;
  }

  async waitUntil(condition) {
    return await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (condition) {
          resolve("foo");
          clearInterval(interval);
        }
      }, 1000);
    });
  }

  async getCompletion(story) {
    let client = this;
    this.story = story;
    console.log("get completion", story);
    let llm_request_message = {
      prompt: this.generateCompletionPrompt(story),
      params: this.params,
      models: this.models,
      workers: this.workers,
    };

    const headers = {
      Accept: "application/json",
      apikey: this.horde_api_key,
      "Client-Agent": this.client_agent,
      "Content-Type": "application/json",
    };
    let start = Date.now();

    let response = await axios({
      method: "post",
      url: this.horde_url + "generate/text/async",
      data: llm_request_message,
      headers: headers,
    });
    console.log(response, response.data);

    let timer;
    timer = await setInterval(async function () {
      let check = await axios({
        method: "get",
        url: client.horde_url + "generate/text/status/" + response.data.id,
        // data: message,
        headers: headers,
      });
      //this.check = check
      //console.log("check", check, done);
      // done = check.data.done;

      // app.memory[response.data.id].queue_position == undefined ? app.memory[response.data.id].queue_position = check.data.queue_position : "";
      // app.memory[response.data.id].wait_time == undefined ? app.memory[response.data.id].wait_time = check.data.wait_time : "";
      // app.updateCheck(check);
      // app.$refs.messages.scroll({ top: app.$refs.messages.scrollHeight, behavior: "smooth" })

      if (check.data.done == true) {
        //If the current height is not the same as the initial height,
        if (
          check.data.generations[0].text.trim().length > 0 ||
          check.data.generations[0].text.trim() == "]"
        ) {
          let end = Date.now();
          let message_id = uuidv4();
          let text = check.data.generations[0].text
            .replace("[RESPONSE]", "")
            .replace("[/RESPONSE]", "")
            .trim();

          console.log("IA MESSAGE ID", message_id);

          story.messages.push({
            id: message_id,
            text: text,
            isUser: false,
            start: start,
            end: end,
            model: check.data.generations[0].model,
            worker_id: check.data.generations[0].worker_id,
            worker_name: check.data.generations[0].worker_name,
            duration: Math.round((end - start) / 1000),
          });
          story.status = null;
          client.generateImagePrompt({
            story: story,
            message_id: message_id,
            text: text,
          });
          //app.$refs.messages.scroll({ top: app.$refs.messages.scrollHeight, behavior: "smooth" })
        } else {
          console.log("ERROR, should renew Completion request");
          //app.status = "Attends, j'ai du mal à me concentrer, je recommence... "
          //app.input = app.story.messageHistory.pop().text
          //app.transmettre()
        }
        // console.log("it is done", check);
        // app.memory[response.data.id].end = Date.now();
        // app.memory[response.data.id].response = check.data.generations[0].text;
        // app.memory[response.data.id].model = check.data.generations[0].model;
        // console.log("Memory", app.memory);
        clearInterval(timer); //Stop the timer
      } else {
        story.status = check.data;
        console.log(check.data);
      }
    }, 1000);
    //this.$store.commit('core/incrementLevel')
  }
  generateCompletionPrompt(story) {
    let locale = story.options.lang;
    this.lang = this.langues[locale];
    this.prenom = story.options.heros.prenom;
    this.sexe = story.options.heros.sexe;
    console.log(this.lang, this.prenom, this.sexe);

    let system_prompt_brut = story.options.mission[1].system_prompt.join("\n");
    console.log("SYSTEM PROMPT BRUT", system_prompt_brut);
    let system_prompt = eval("`" + system_prompt_brut + "`");
    console.log("system_prompt", system_prompt);
    let history = story.messages
      .map((message) =>
        message.isUser ? `[INST] ${message.text} [/INST]` : `${message.text}`
      )
      .join("\n");
    return system_prompt + "\n" + history;
  }

  async generateImagePrompt(options) {
    let client = this;

    console.log("generate image for ", options);
    let sys_prompt = `Here’s a formula for a Stable Diffusion image prompt:
     An image of[adjective][subject][doing action], [creative lighting style],
    detailed, realistic, trending on artstation, in style of[famous artist 1], [famous artist 2], [famous artist 3].
    `;
    let prompt = `
    L'invite ci-dessous est une question à laquelle répondre, une tâche à accomplir ou une conversation à laquelle répondre ; Décidez et rédigez une réponse appropriée.
        [INST]${sys_prompt}. You must write an image prompt representing ${options.text} following this formula. Give me only the image prompt starting with "an photo of..."[/INST]
        [RESPONSE]
        `;

    console.log("sd prompt before", prompt);

    let message = {
      prompt: prompt, //this.generatePrompt(),
      params: this.params,
      models: this.models,
      workers: this.workers,
    };
    const headers = {
      Accept: "application/json",
      apikey: this.horde_api_key,
      "Client-Agent": this.client_agent,
      "Content-Type": "application/json",
    };
    // let start = Date.now();

    let response = await axios({
      method: "post",
      url: client.horde_url + "generate/text/async",
      data: message,
      headers: headers,
    });
    console.log(response, response.data);

    // app.$refs.messages.scroll({ top: app.$refs.messages.scrollHeight, behavior: "smooth" })

    let timer;

    //let done = false;

    timer = await setInterval(async function () {
      let check = await axios({
        method: "get",
        url: client.horde_url + "generate/text/status/" + response.data.id,
        // data: message,
        headers: headers,
      });
      //this.check = check
      //console.log("check", check, done);
      // done = check.data.done;

      // app.memory[response.data.id].queue_position == undefined ? app.memory[response.data.id].queue_position = check.data.queue_position : "";
      // app.memory[response.data.id].wait_time == undefined ? app.memory[response.data.id].wait_time = check.data.wait_time : "";
      // app.updateCheck(check);
      // app.$refs.messages.scroll({ top: app.$refs.messages.scrollHeight, behavior: "smooth" })

      if (check.data.done == true) {
        //If the current height is not the same as the initial height,
        if (check.data.generations[0].text.trim().length > 0) {
          let sd_prompt = check.data.generations[0].text;
          // let end = Date.now()

          console.log("THE SD PROMPT !!!!!", sd_prompt);
          let currentMessage = options.story.messages.find(
            (m) => m.id == options.message_id
          );
          currentMessage.sd_prompt = sd_prompt;

          console.log(options.message_id, currentMessage, options.story);

          client.generateImage({ sd_prompt: sd_prompt, options: options });

          // app.messageHistory.push({
          //     id: uuidv4(),
          //     text: check.data.generations[0].text.replace('[RESPONSE]', '').replace('[/RESPONSE]', '').trim(),
          //     isUser: false,
          //     start: start,
          //     end: end,
          //     model: check.data.generations[0].model,
          //     worker_id: check.data.generations[0].worker_id,
          //     worker_name: check.data.generations[0].worker_name,
          //     duration: Math.round((end - start) / 1000)
          // });
          // app.status = null
          // app.$refs.messages.scroll({ top: app.$refs.messages.scrollHeight, behavior: "smooth" })
        } else {
          // app.status = "Attends, j'ai du mal à me concentrer, je recommence... "
          // app.input = app.story.messageHistory.pop().text
          // app.transmettre()
          console.log("error when generating image prompt");
        }
        // console.log("it is done", check);
        // app.memory[response.data.id].end = Date.now();
        // app.memory[response.data.id].response = check.data.generations[0].text;
        // app.memory[response.data.id].model = check.data.generations[0].model;
        // console.log("Memory", app.memory);
        clearInterval(timer); //Stop the timer
      } else {
        options.story.status = check.data;
      }
    }, 1000);
  }
  async generateImage(options) {
    let client = this;
    let message = {
      prompt: options.sd_prompt,
      params: this.imgen_params,
      //models: this.models,
      workers: this.workers,
      nsfw: true,
      censor_nsfw: false,
      trusted_workers: false,
      models: [
        // "Comic-Diffusion"
      ],
      // "models": ["ICBINP - I Can't Believe It's Not Photography", "Dreamshaper"],
      // "models": ["Dreamshaper", "stable_diffusion"],
      r2: true,
      dry_run: false,
    };
    const headers = {
      Accept: "application/json",
      apikey: this.horde_api_key,
      "Client-Agent": this.client_agent,
      "Content-Type": "application/json",
    };
    //let start = Date.now();

    let response = await axios({
      method: "post",
      url: client.horde_url + "generate/async",
      data: message,
      headers: headers,
    });
    console.log(response, response.data);

    // app.$refs.messages.scroll({ top: app.$refs.messages.scrollHeight, behavior: "smooth" })
    if (response.data.id != undefined) {
      let timer;

      //let done = false;

      timer = await setInterval(async function () {
        let check = await axios({
          method: "get",
          url: client.horde_url + "generate/check/" + response.data.id,
          // data: message,
          headers: headers,
        });
        //this.check = check
        console.log("check", check);
        // done = check.data.done;

        // app.memory[response.data.id].queue_position == undefined ? app.memory[response.data.id].queue_position = check.data.queue_position : "";
        // app.memory[response.data.id].wait_time == undefined ? app.memory[response.data.id].wait_time = check.data.wait_time : "";
        // app.updateCheck(check);
        //     app.$refs.messages.scroll({ top: app.$refs.messages.scrollHeight, behavior: "smooth" })

        if (check.data.done == true) {
          //If the current height is not the same as the initial height,
          let status = await axios({
            method: "get",
            url: client.horde_url + "generate/status/" + response.data.id,
            // data: message,
            headers: headers,
          });
          console.log("status", status);

          //   client.story.images.push(status.data.generations[0])

          //   let currentMessage = client.story.messages.find(
          //     (m) => (m.id == options.options.message_id)
          //   )
          //   currentMessage.image = { url: status.data.generations[0] }
          const message_id = options.options.message_id;

          const toDataURL = (url) =>
            fetch(url)
              .then((response) => response.blob())
              .then(
                (blob) =>
                  new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                  })
              );

          toDataURL(status.data.generations[0].img).then((dataUrl) => {
            console.log("RESULT:", dataUrl);
            client.story.images[message_id] = dataUrl;
            console.log("THE STORY WITH IMAGE", client.story);
          });

          //                         app.toDataURL('https://www.gravatar.com/avatar/d50c83cc0c6523b4d3f6085295c953e0', function(dataUrl) {
          //   console.log('RESULT:', dataUrl)
          // })

          // app.toDataURL(status.data.generations[0])
          //     .then(dataUrl => {
          //         console.log('img Base 64 RESULT:', dataUrl)
          //     })
          // console.log("it is done", check);
          // app.memory[response.data.id].end = Date.now();
          // app.memory[response.data.id].response = check.data.generations[0].text;
          // app.memory[response.data.id].model = check.data.generations[0].model;
          // console.log("Memory", app.memory);
          clearInterval(timer); //Stop the timer
        } else {
          client.story.status = check.data;
        }
      }, 1000);
    } else {
      console.log("id undefined", response);
    }
  }
}
