from autogen import AssistantAgent, UserProxyAgent, config_list_from_json
import autogen

# Load LLM inference endpoints from an env variable or a file
# See https://microsoft.github.io/autogen/docs/FAQ#set-your-api-endpoints
# and OAI_CONFIG_LIST_sample
config_list = config_list_from_json(env_or_file="OAI_CONFIG_LIST")
#assistant = AssistantAgent("assistant", llm_config={"config_list": config_list, "use_cache": False})
planner = autogen.AssistantAgent(
    name="planner",
    llm_config={"config_list": config_list},
    # the default system message of the AssistantAgent is overwritten here
    system_message="You are a helpful AI assistant. You suggest coding and reasoning steps for another AI assistant to accomplish a task. Do not suggest concrete code. For any action beyond writing code or reasoning, convert it to a step that can be implemented by writing code. For example, browsing the web can be implemented by writing code that reads and prints the content of a web page. Finally, inspect the execution result. If the plan is not good, suggest a better plan. If the execution is wrong, analyze the error and suggest a fix."
)
planner_user = autogen.UserProxyAgent(
    name="planner_user",
    max_consecutive_auto_reply=0,  # terminate without auto-reply
    human_input_mode="NEVER",
)

def ask_planner(message):
    planner_user.initiate_chat(planner, message=message)
    # return the last message received from the planner
    return planner_user.last_message()["content"]

# create an AssistantAgent instance named "assistant"
assistant = autogen.AssistantAgent(
    name="assistant",
    llm_config={
        "temperature": 0,
        "timeout": 600,
        "seed": 42,
        "use_cache": False,
        "config_list": config_list,
        "functions": [
            {
                "name": "ask_planner",
                "description": "ask planner to: 1. get a plan for finishing a task, 2. verify the execution result of the plan and potentially suggest new plan.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "message": {
                            "type": "string",
                            "description": "question to ask planner. Make sure the question include enough context, such as the code and the execution result. The planner does not know the conversation between you and the user, unless you share the conversation with the planner.",
                        },
                    },
                    "required": ["message"],
                },
            },
        ],
    }
)

# create a UserProxyAgent instance named "user_proxy"
user_proxy = autogen.UserProxyAgent(
    name="user_proxy",
    human_input_mode="TERMINATE",
    max_consecutive_auto_reply=10,
    # is_termination_msg=lambda x: "content" in x and x["content"] is not None and x["content"].rstrip().endswith("TERMINATE"),
    code_execution_config={"work_dir": "planning", "use_docker": "python:3"},
    function_map={"ask_planner": ask_planner},
)

# the assistant receives a message from the user, which contains the task description
user_proxy.initiate_chat(
    assistant,
   #message="""Suggest a fix to an open good first issue of flaml""",
   #message="""Create a n obsidian plugin to synchronize obsidian notes to a Solid Pod""",
   #message="""Create an example using https://github.com/y-crdt/ypy that connect to http://yjs-leveldb.glitch.me/ backend"""
   message="""Use horde api at https://aihorde.net/api/swagger.json and horde cli https://github.com/Haidra-Org/AI-Horde-CLIto understand how to use text generation (http/v2/generate/text/async), image generation and get the results. this example code can help you https://github.com/scenaristeur/numerai/blob/main/src/api/horde_client.js . Once you have understand and tested the api, use it to create a 3 pages comic book and store the steps and results in work_dir"""
)

