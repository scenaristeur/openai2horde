from autogen import AssistantAgent, UserProxyAgent, config_list_from_json

# Load LLM inference endpoints from an env variable or a file
# See https://microsoft.github.io/autogen/docs/FAQ#set-your-api-endpoints
# and OAI_CONFIG_LIST_sample
config_list = config_list_from_json(env_or_file="OAI_CONFIG_LIST")
assistant = AssistantAgent("assistant", llm_config={"config_list": config_list, "use_cache": False})
user_proxy = UserProxyAgent("user_proxy", code_execution_config={"work_dir": "coding"})

#user_proxy.initiate_chat(assistant, message="Create a Snake game")
#user_proxy.initiate_chat(assistant, message="Plot a chart of NVDA and TESLA stock price change YTD")
user_proxy.initiate_chat(assistant, message="build a simple hangman game, but include a visual representation of a stick man being hanged for every wrong guess. Allow one player to input the word to guess (hide their input like a password field) and then player 2 gets 10 guesses.")