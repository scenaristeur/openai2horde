import os
import autogen
import memgpt.autogen.memgpt_agent as memgpt_autogen
import memgpt.autogen.interface as autogen_interface 
import memgpt.agent as agent
import memgpt.system as system
import memgpt.utils as utils
import memgpt.presets as presets
import memgpt.constants as constants
import memgpt.personas.personas as personas
import memgpt.humans.humans as humans
from memgpt.persistence_manager import InMemoryStateManager, InMemoryStateManagerWithPreloadedArchivalMemory, InMemoryStateManagerWithFaiss
from memgpt.autogen.memgpt_agent import create_autogen_memgpt_agent, create_memgpt_autogen_agent_from_config

import openai
# openai.api_key = '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'

# config_list = [
#     {
#         'model': 'gpt-4'
#     },
# ]

config_list = autogen.config_list_from_json(env_or_file="OAI_CONFIG_LIST")

config_list_memgpt = autogen.config_list_from_json(env_or_file="OAI_CONFIG_LIST")

openai.api_base="http://localhost:5678/v1"
openai.api_key="NULL"

USE_MEMGPT = True

USE_AUTOGEN_WORKFLOW = True

# Set to True if you want to print MemGPT's inner workings.
DEBUG = True

interface_kwargs = {
    "debug": DEBUG,
    "show_inner_thoughts": DEBUG,
    "show_function_outputs": DEBUG,
}

llm_config = {"config_list": config_list, "seed": 42}
user_proxy = autogen.UserProxyAgent(
    name="User_proxy",
    system_message="A human admin.",
    code_execution_config={"last_n_messages": 2, "work_dir": "groupchat"},
)

interface = autogen_interface.AutoGenInterface() # how MemGPT talks to AutoGen
persistence_manager = InMemoryStateManager()
# persona = "I\'m a 10x engineer at a FAANG tech company."
# human = "I\'m a team manager at a FAANG tech company."
#memgpt_agent = presets.use_preset(presets.DEFAULT, 'gpt-4', persona, human, interface, persistence_manager)

# MemGPT coder
# coder = memgpt_autogen.MemGPTAgent(
#     name="MemGPT_coder",
#     agent=memgpt_agent,
# )

# The agent playing the role of the product manager (PM)
pm = autogen.AssistantAgent(
    name="Product_manager",
    system_message="Creative in software product ideas.",
    llm_config=llm_config,
    default_auto_reply="...",  # Set a default auto-reply message here (non-empty auto-reply is required for LM Studio)
)

coder = create_autogen_memgpt_agent(
            "MemGPT_coder",
            persona_description="I am a 10x engineer, trained in Python. I was the first engineer at Uber "
            "(which I make sure to tell everyone I work with).",
            user_description=f"You are participating in a group chat with a user ({user_proxy.name}) "
            f"and a product manager ({pm.name}).",
            model=config_list_memgpt[0]["model"],
            interface_kwargs=interface_kwargs,
        )

# non-MemGPT PM
pm = autogen.AssistantAgent(
    name="Product_manager",
    system_message="Creative in software product ideas.",
    llm_config=llm_config,
)

groupchat = autogen.GroupChat(agents=[user_proxy, coder, pm], messages=[], max_round=12)
manager = autogen.GroupChatManager(groupchat=groupchat, llm_config=llm_config)

user_proxy.initiate_chat(manager, message="First send the message 'Let's go Mario!'")