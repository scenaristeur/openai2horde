# retrieve Chat https://github.com/microsoft/autogen/blob/main/notebook/agentchat_RetrieveChat.ipynb

from autogen import AssistantAgent, UserProxyAgent, config_list_from_json
import autogen

# Load LLM inference endpoints from an env variable or a file
# See https://microsoft.github.io/autogen/docs/FAQ#set-your-api-endpoints
# and OAI_CONFIG_LIST_sample
config_list = config_list_from_json(env_or_file="OAI_CONFIG_LIST")

print("utiliser le modele 'aphrodite/elinas/chronos007-70b'"  )

llm_config = {
    "timeout": 60,
    "seed": 12,
    "config_list": config_list,
    "temperature": 0,
    "use_cache": False
}

# Accepted file formats for that can be stored in 
# a vector database instance
from autogen.retrieve_utils import TEXT_FORMATS

print("Accepted file formats for `docs_path`:")
print(TEXT_FORMATS)

from autogen.agentchat.contrib.retrieve_assistant_agent import RetrieveAssistantAgent
from autogen.agentchat.contrib.retrieve_user_proxy_agent import RetrieveUserProxyAgent
import chromadb

# 1. create an RetrieveAssistantAgent instance named "assistant"
assistant = RetrieveAssistantAgent(
    name="assistant", 
    system_message="You are a helpful assistant.",
    llm_config={
        "timeout": 600,
        "cache_seed": 42,
        "config_list": config_list,
    },
)

# 2. create the RetrieveUserProxyAgent instance named "ragproxyagent"
# By default, the human_input_mode is "ALWAYS", which means the agent will ask for human input at every step. We set it to "NEVER" here.
# `docs_path` is the path to the docs directory. It can also be the path to a single file, or the url to a single file. By default, 
# it is set to None, which works only if the collection is already created.
# 
# Here we generated the documentations from FLAML's docstrings. Not needed if you just want to try this notebook but not to reproduce the
# outputs. Clone the FLAML (https://github.com/microsoft/FLAML) repo and navigate to its website folder. Pip install and run `pydoc-markdown`
# and it will generate folder `reference` under `website/docs`.
#
# `task` indicates the kind of task we're working on. In this example, it's a `code` task.
# `chunk_token_size` is the chunk token size for the retrieve chat. By default, it is set to `max_tokens * 0.6`, here we set it to 2000.
ragproxyagent = RetrieveUserProxyAgent(
    name="ragproxyagent",
    #human_input_mode="NEVER",
    human_input_mode="ALWAYS",
    max_consecutive_auto_reply=10,
    retrieve_config={
        "task": "code",
        #"doc_path": "https://www.impots.gouv.fr/www2/fichiers/documentation/brochure/ir_2023/pdf_integral/Brochure-IR-2023.pdf",
        "docs_path": "https://www.legifrance.gouv.fr/download/file/pdf/LEGITEXT000006069577.pdf/LEGI",
        "chunk_token_size": 2000,
        "model": config_list[0]["model"],
        "client": chromadb.PersistentClient(path="../chromadb/fiscai_cgi"),
        "embedding_model": "all-mpnet-base-v2",
        "get_or_create": True,  # set to False if you don't want to reuse an existing collection, but you'll need to remove the collection manually
    },
)

# reset the assistant. Always reset the assistant before starting a new conversation.
assistant.reset()

# given a problem, we use the ragproxyagent to generate a prompt to be sent to the assistant as the initial message.
# the assistant receives the message and generates a response. The response will be sent back to the ragproxyagent for processing.
# The conversation continues until the termination condition is met, in RetrieveChat, the termination condition when no human-in-loop is no code block detected.
# With human-in-loop, the conversation will continue until the user says "exit".
#code_problem = "How can I use FLAML to perform a classification task and use spark to do parallel training. Train 30 seconds and force cancel jobs if time limit is reached."
#code_problem = "Je souhaite créer une application Streamlit qui me permette de gérer tous les aspects de l'holacratie."
#problem = "Tu dois aider un groupe de personnes à mettre en place l'Holacratie au sein de leur organisation. le contexte du projet est décrit sur la page https://scenaristeur.github.io/cdr/ Définit les prochaines actions."
problem = "Comment sont imposés les revenus fonciers?"

ragproxyagent.initiate_chat(assistant, problem=problem, 
                            #search_string="spark"
                            )  # search_string is used as an extra filter for the embeddings search, in this case, we only want to search documents that contain "spark".