# https://microsoft.github.io/autogen/blog/2023/10/26/TeachableAgent/#example-1---learning-user-info


from autogen import UserProxyAgent, config_list_from_json
from autogen.agentchat.contrib.teachable_agent import TeachableAgent

config_list = config_list_from_json(env_or_file="OAI_CONFIG_LIST")
# assistant = AssistantAgent("assistant", llm_config={"config_list": config_list, "use_cache": False})
llm_config={"config_list": config_list, "timeout": 120}

teachable_agent = TeachableAgent(
    name="teachableagent",
    llm_config=llm_config,
    teach_config={
        "reset_db": False,  # Use True to force-reset the memo DB, and False to use an existing DB.
        "path_to_db_dir": "./tmp/interactive/teachable_agent_db"  # Can be any path.
    }
)

user = UserProxyAgent("user", human_input_mode="ALWAYS")
# This function will return once the user types 'exit'.
# teachable_agent.initiate_chat(user, message="Hi, I'm a teachable user assistant! What's on your mind?")
teachable_agent.initiate_chat(user, message="Salut, je suis un agent qui peut apprendre! Qu'as-tu en tête aujourd'hui?")

teachable_agent.learn_from_user_feedback()
teachable_agent.close_db()