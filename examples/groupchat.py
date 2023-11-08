from autogen import AssistantAgent, UserProxyAgent, config_list_from_json


import autogen

config_list = config_list_from_json(env_or_file="OAI_CONFIG_LIST")


llm_config = {"config_list": config_list, "seed": 42, "use_cache": False}
user_proxy = autogen.UserProxyAgent(
   name="User_proxy",
   system_message="A human admin.",
   code_execution_config={"last_n_messages": 2, "work_dir": "groupchat"},
   human_input_mode="TERMINATE"
)
coder = autogen.AssistantAgent(
    name="Coder",
    llm_config=llm_config,
)
pm = autogen.AssistantAgent(
    name="Product_manager",
    system_message="Creative in software product ideas.",
    llm_config=llm_config,
)
groupchat = autogen.GroupChat(agents=[user_proxy, coder, pm], messages=[], max_round=12)
manager = autogen.GroupChatManager(groupchat=groupchat, llm_config=llm_config)


user_proxy.initiate_chat(manager, message="Create a snake game.")
# type exit to terminate the chat