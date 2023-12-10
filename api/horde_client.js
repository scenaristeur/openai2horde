import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import * as fs from "fs";

var stream = fs.createWriteStream(".logs/horde_client_" + Date.now() + ".log", {
  flags: "a",
});
stream.once("open", function (fd) {
  stream.write("HORDE_CLIENT_LOG" + "\r\n");
});

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
    this.language = options.DEFAULT_LANGUAGE || "english";
    this.params = {
      n: 1,
      max_context_length: 2048,
      max_length: 512,
      rep_pen: 1.1,
      temperature: 0.7, //0.7,
      top_p: 0.92,
      top_k: 0,
      top_a: 0,
      typical: 1,
      tfs: 1,
      rep_pen_range: 320,
      rep_pen_slope: 0.7,
      sampler_order: [6, 0, 1, 3, 4, 2, 5],
      use_default_badwordsids: false,
      //stop: [".", "[INST]"],
      
    };
    this.models = [
      //'aphrodite/Sao10K/Euryale-1.3-L2-70B',
      //"aphrodite/Sao10K/Stheno-1.8-L2-13B"
      // "koboldcpp/mistrp-airoboros-7b",
      // "koboldcpp/mistrp-airoboros-7b",
      // "Norquinal/Mistral-7B-claude-chat",
      // "koboldcpp/mistral-pygmalion-7b.Q5_K_M",
      // "koboldcpp/openhermes-2.5-mistral-7b.Q6_K.gguf"
      // DOChttps://stablehorde.net/
      // choose from https://github.com/koboldai/koboldai-client
      // hosted on https://stablehorde.net/api/v2/workers?type=text
      //       "facebook/opt-2.7b",
      //       "facebook/opt-13b", //https://huggingface.co/facebook/opt-13b
      //       "KoboldAI/fairseq-dense-2.7B", // https://huggingface.co/KoboldAI/fairseq-dense-2.7B
      // "TheBloke/MythoMax-L2-13B-GPTQ", // https://huggingface.co/TheBloke/MythoMax-L2-13B-GPTQ
      // "jondurbin/airoboros-13b", //https://huggingface.co/jondurbin/airoboros-13b
      // "EleutherAI/gpt-neox-20b", // https://huggingface.co/EleutherAI/gpt-neox-20b
      // "KoboldAI/fairseq-dense-13B", // https://huggingface.co/KoboldAI/fairseq-dense-13B
      // "EleutherAI/gpt-j-6b", //"https://huggingface.co/EleutherAI/gpt-j-6b"
      // "KoboldAI/LLaMA2-13B-Tiefighter",
      // "Undi95/Emerhyst-13B",
      // "elinas/chronos-13b",
      // "EleutherAI/gpt-neo-2.7B"
      //"koboldcpp/OpenHermes-2.5-Mistral-7b",
      //"aphrodite/elinas/chronos007-70b" # PAS MAL pour holacratie
      //"koboldcpp/LLaMA2-13B-TiefighterLR",
      //"aphrodite/codellama/CodeLlama-34b-Instruct-hf"
      // perspicace pour les revenus fonciers de examples/groupchatRAG_FiscAi.py
      //"aphrodite/teknium/OpenHermes-2.5-Mistral-7B"
      //"koboldcpp/LLaMA2-13B-TiefighterLR",
      //"aphrodite/Sao10K/Stheno-1.8-L2-13B", // français cohérent et concis
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
    this.headers = {
      Accept: "application/json",
      apikey: this.horde_api_key,
      "Client-Agent": this.client_agent,
      "Content-Type": "application/json",
    };
    this.workers = [];
    console.log("HORDE CLIENT READY");
  }

  async completions2(params) {
    let response = {
      choices: [
        {
          finish_reason: "stop",
          index: 0,
          message: {
            content:
              "The 2020 World Series was played in Texas at Globe Life Field in Arlington.",
            role: "assistant",
          },
        },
      ],
      created: 1677664795,
      id: "chatcmpl-7QyqpwdfhqwajicIEznoc6Q47XAyW",
      model: "gpt-3.5-turbo-0613",
      object: "chat.completion",
      usage: {
        completion_tokens: 17,
        prompt_tokens: 57,
        total_tokens: 74,
      },
    };




    
    return response;
  }

  async completions(params) {
    let client = this;
    let result = { job: {} };
    let prompt = params.test_single_prompt == true ? params.prompt  : JSON.stringify(params.messages) // lorsque l'on envoie juste un prompt, la réponse est au bon format . params.prompt 
    let llm_request_message = {
      prompt: prompt,
      params: this.params,
      models: /*params.models || */ this.models,
      workers: this.workers,
      seed: 45,
      nfsw: true
    };

    console.log("###############REQUEST PARAMS", llm_request_message);
    //console.log('headers', headers)
    result.start = Date.now();
    try {
      let response = await axios({
        method: "post",
        url: this.horde_url + "generate/text/async",
        data: llm_request_message,
        headers: this.headers,
      });
      console.log(/*response, */ response.data);

      // let check = await axios({
      //   method: "get",
      //   url: this.horde_url + "generate/text/status/" + response.data.id,
      //   // data: message,
      //   headers: this.headers,
      // });

      let textPromise = new Promise((resolve, reject) => {
        let timer = setInterval(async function () {
          let check = await axios({
            method: "get",
            url: client.horde_url + "generate/text/status/" + response.data.id,
            headers: client.headers,
          });

          if (check.data.done == true) {
            result.end = Date.now();
            console.log("--GENERATION\n", check.data.generations[0], "\n--");
            let text =
              check.data.generations[0] &&
              check.data.generations[0].text.trim();

            console.log("----- text generated : ", text, "\n-----\n");

            result.job = check.data.generations[0];

            clearInterval(timer); // Stop the timer
            resolve(text); // Résoudre la promesse avec le texte
          } else {
            console.log(check.data);
          }
        }, 3000);
      });

      const text = await textPromise; // Attendre que la promesse soit résolue
      result.text = text;
      console.log("RETURN RESULT", result);

      stream.write(JSON.stringify(result) + "\r\n");

      if (
        result.text == undefined ||
        result.text.trim().length == 0 ||
        result.text.trim() == "}]" ||
        result.text.trim() == "]" ||
        result.text.trim() == "}"
      ) {
        console.log("Text length = 0, retry");
        result = await this.completions(params);
      }

      return result;
    } catch (e) {
      console.log("ERREUR", e);
    }
  }

  async getModels(options = {}) {
    console.log(options);
    //https://stablehorde.net/api/v2/workers?type=text

    try {
      let res = await axios({
        method: "get",
        url: this.horde_url + "status/models",
        // data: message,
        headers: this.headers,
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.status);
      }
      // Don't forget to return something
      // console.log(res.data);
      return res.data.filter((model) => model.performance > 0);
    } catch (err) {
      console.error(err);
    }
    //console.log(res);
    return res;
  }

  async getScribes(options = {}) {
    console.log(options);
    //https://stablehorde.net/api/v2/workers?type=text

    try {
      let res = await axios({
        method: "get",
        url: this.horde_url + "workers?type=text",
        // data: message,
        headers: this.headers,
      });
      if (res.status == 200) {
        // test for status you want, etc
        console.log(res.status);
      }
      // Don't forget to return something
      // console.log(res.data);
      // hack beacaus eperf is text and not number
      // ex:     performance: '8.5 tokens per second',

      let scribes = res.data.map((s) => {
        var temp = Object.assign({}, s);
        temp.performance = parseFloat(s.performance.split(" ")[0]);
        return temp;
      });

      // sort by perf
      scribes = scribes.sort((a, b) => b.performance - a.performance);

      return scribes.filter((scribe) => scribe.online == true);
    } catch (err) {
      console.error(err);
    }
    //console.log(res);
    return res;
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
