from autogen import AssistantAgent, UserProxyAgent, config_list_from_json
import autogen

# config_list_gpt4 = [{
#     "model": "gpt-4",
#     "api_key": "<KEY>"
# }
# ]

config_list = config_list_from_json(env_or_file="OAI_CONFIG_LIST")

gpt4_config = { 
    "seed": 42,  # change the seed for different trials
    "temperature": 0,
    "config_list": config_list,
    "request_timeout": 120,
}

screen_writer = autogen.UserProxyAgent(
    name="screen_writer",
    system_message="A human screen writer. Dialoge needs to be approved by this screen writer.",
    code_execution_config=False,
)
monica_mingle = autogen.AssistantAgent(
    name="monica_mingle",
    llm_config=gpt4_config,
    system_message='''Monica Mingle. Inspired by Monica Geller, she's a perfectionist and an obsessive-compulsive chef. She's always trying to host the perfect party and is competitive to a fault.
''',
)

joey_jumble = autogen.AssistantAgent(
    name="joey_jumble",
    llm_config=gpt4_config,
    system_message='''Based on Joey Tribbiani, he's a lovable, not-so-bright actor who often gets his words mixed up. He's known for his catchphrase, "How you doin'?", and has an insatiable appetite, especially for pizza 
''',
)
critic = autogen.AssistantAgent(
    name="Critic",
    system_message="Critic. Double check script, make sure the dialogue between monica mingle and joey jumble is hillarious. provide feedback.",
    llm_config=gpt4_config,
)

groupchat = autogen.GroupChat(agents=[
                              screen_writer, monica_mingle, joey_jumble, critic], messages=[], max_round=5)
manager = autogen.GroupChatManager(groupchat=groupchat, llm_config=gpt4_config)

screen_writer.initiate_chat(
    manager,
    message="""
screen write a birthday party the result must be in French
""",
)