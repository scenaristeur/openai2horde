# https://www.youtube.com/watch?v=3Wely4le6jo

import autogen
from autogen.agentchat.contrib.gpt_assistant_agent import GPTAssistantAgent
import openai

client = openai.OpenAI()

from autogen import UserProxyAgent, config_list_from_json
from autogen.agentchat.contrib.teachable_agent import TeachableAgent

config_list = config_list_from_json(env_or_file="OAI_CONFIG_LIST")

assistant = client.beta.assistants.create(
    name="Customer Service Assistant",
    instructions="You are a customer support chatbot. Use your knowledge base to best respond to customer queries.",
    model="gpt-4-1106-preview"
)

config_list = [{"model": "gpt-4-1106-preview"}]
llm_config = { 
    "config_list": config_list, 
    "assistant_id": assistant.id
}

gpt_assistant = GPTAssistantAgent(
    name="assistant",
    instructions=autogen.AssistantAgent.DEFAULT_SYSTEM_MESSAGE,
    llm_config=llm_config
)


user_proxy = autogen.UserProxyAgent(
    name="MervinPraison",
    code_execution_config={
        "work_dir" : "coding",
    }
)

user_proxy.initiate_chat(
    gpt_assistant,
    message="Create a sky invader game, execute it and save the game in the file"
)