import chromadb
from autogen import AssistantAgent
from autogen.agentchat.contrib.retrieve_user_proxy_agent import RetrieveUserProxyAgent
from autogen import AssistantAgent, UserProxyAgent, config_list_from_json
import autogen

# Load LLM inference endpoints from an env variable or a file
# See https://microsoft.github.io/autogen/docs/FAQ#set-your-api-endpoints
# and OAI_CONFIG_LIST_sample
config_list = config_list_from_json(env_or_file="OAI_CONFIG_LIST")


llm_config = {
    "timeout": 60,
    "seed": 1,
    "config_list": config_list,
    "temperature": 0.7,
    "use_cache": False
}

# llm_coder_config = {
#       "timeout": 60,
#     "seed": 402,
#     "config_list": config_list,
#     "temperature": 0,
#     "use_cache": False
# }

# autogen.ChatCompletion.start_logging()


def termination_msg(x): return isinstance(
    x, dict) and "TERMINATE" == str(x.get("content", ""))[-9:].upper()


boss = autogen.UserProxyAgent(
    name="Boss",
    is_termination_msg=termination_msg,
    human_input_mode="TERMINATE",
    max_consecutive_auto_reply=10,
    system_message="""The boss who ask questions and give tasks. Reply TERMINATE if the task has been solved at full satisfaction. Otherwise, reply CONTINUE, or the reason why the task is not solved yet.""",
    code_execution_config={
        "work_dir": "_holacratie", "use_docker": "python:3"},
    # code_execution_config=False,  # we don't want to execute code in this case.
)

# boss_aid = RetrieveUserProxyAgent(
#     name="Boss_Assistant",
#     is_termination_msg=termination_msg,
#     system_message="Assistant who has extra content retrieval power for solving difficult problems.",
#     human_input_mode="TERMINATE",
#     max_consecutive_auto_reply=3,
#     retrieve_config={
#         "task": "code",
#         "docs_path": "https://raw.githubusercontent.com/holacracyone/Holacracy-Constitution-4.1-FRENCH/master/Constitution-Holacracy.md", #"~/code/FLAML/website/docs/reference",  # change this to your own path, such as https://raw.githubusercontent.com/microsoft/autogen/main/README.md
# #        "docs_path": "https://raw.githubusercontent.com/microsoft/FLAML/main/website/docs/Examples/Integrate%20-%20Spark.md",
#         "chunk_token_size": 1000,
#         "model": config_list[0]["model"],
#         "client": chromadb.PersistentClient(path="../chromadb/Holacratie"),
#         "collection_name": "holacratie",
#         "get_or_create": True,
#     },
#     code_execution_config=False,  # we don't want to execute code in this case.
# )

boss_aid = RetrieveUserProxyAgent(
    name="ragproxyagent",
    human_input_mode="TERMINATE",
    system_message="Assistant who has extra content retrieval power for solving difficult problems.",
    # human_input_mode="ALWAYS",
    max_consecutive_auto_reply=10,
    retrieve_config={
        "task": "code",
        # "~/code/FLAML/website/docs/reference",  # change this to your own path, such as https://raw.githubusercontent.com/microsoft/autogen/main/README.md
        "docs_path": "https://raw.githubusercontent.com/holacracyone/Holacracy-Constitution-4.1-FRENCH/master/Constitution-Holacracy.md",
        "chunk_token_size": 2000,
        "model": config_list[0]["model"],
         "client": chromadb.PersistentClient(path="../chromadb/Holacratie"),
        "embedding_model": "all-mpnet-base-v2",
        # set to False if you don't want to reuse an existing collection, but you'll need to remove the collection manually
        "get_or_create": True,
    },
)

coder = AssistantAgent(
    name="Senior_Python_Engineer",
    is_termination_msg=termination_msg,
    system_message="If you want the user to save the code in a file before executing it, put # filename: <filename> inside the code block as the first line. You are a senior python engineer. Reply `TERMINATE` in the end when everything is done.",
    llm_config=llm_config,
)

pm = autogen.AssistantAgent(
    name="Product_Manager",
    is_termination_msg=termination_msg,
    system_message="You are a product manager. Reply `TERMINATE` in the end when everything is done.",
    llm_config=llm_config,
)

reviewer = autogen.AssistantAgent(
    name="Code_Reviewer",
    is_termination_msg=termination_msg,
    system_message="You are a code reviewer. Reply `TERMINATE` in the end when everything is done.",
    llm_config=llm_config,
)

# PROBLEM = "How to use spark for parallel training in FLAML? Give me sample code."
#problem = "Comment mettre en place une application Streamlit pour gérer l'Holacratie ?"
problem = "Une application Streamlit pour gérer tous les aspects de l'Holacratie (voir la constitution avec retrieve content). Créé l'application, tester, livrer avec la documentation"
#problem = "Liste les différents aspects de l'holacratie dans la documentaion. Créé l'application en conformité avec cette documentation. Save the code to disk."
# ragproxyagent.initiate_chat(assistant, problem=problem,
# search_string="spark"
#                            )  # search_string is used as an extra filter for the embeddings search, in this case, we only want to search documents that contain "spark".


def _reset_agents():
    boss.reset()
    boss_aid.reset()
    coder.reset()
    pm.reset()
    reviewer.reset()


def rag_chat():
    _reset_agents()
    groupchat = autogen.GroupChat(
        agents=[boss_aid, coder, pm, reviewer], messages=[], max_round=12
    )
    manager = autogen.GroupChatManager(
        groupchat=groupchat, llm_config=llm_config)

    # Start chatting with boss_aid as this is the user proxy agent.
    boss_aid.initiate_chat(
        manager,
        problem=problem,
        n_results=3,
    )


def norag_chat():
    _reset_agents()
    groupchat = autogen.GroupChat(
        agents=[boss, coder, pm, reviewer], messages=[], max_round=12
    )
    manager = autogen.GroupChatManager(
        groupchat=groupchat, llm_config=llm_config)

    # Start chatting with boss as this is the user proxy agent.
    boss.initiate_chat(
        manager,
        message=problem,
    )


def call_rag_chat():
    _reset_agents()
    # In this case, we will have multiple user proxy agents and we don't initiate the chat
    # with RAG user proxy agent.
    # In order to use RAG user proxy agent, we need to wrap RAG agents in a function and call
    # it from other agents.

    def retrieve_content(message, n_results=3):
        # Set the number of results to be retrieved.
        boss_aid.n_results = n_results
        # Check if we need to update the context.
        update_context_case1, update_context_case2 = boss_aid._check_update_context(
            message)
        if (update_context_case1 or update_context_case2) and boss_aid.update_context:
            boss_aid.problem = message if not hasattr(
                boss_aid, "problem") else boss_aid.problem
            _, ret_msg = boss_aid._generate_retrieve_user_reply(message)
        else:
            ret_msg = boss_aid.generate_init_message(
                message, n_results=n_results)
        return ret_msg if ret_msg else message

    # Disable human input for boss_aid since it only retrieves content.
    boss_aid.human_input_mode = "NEVER"

    llm_config = {
        "functions": [
            {
                "name": "retrieve_content",
                "description": "retrieve content for code generation and question answering.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "message": {
                            "type": "string",
                            "description": "Refined message which keeps the original meaning and can be used to retrieve content for code generation and question answering.",
                        }
                    },
                    "required": ["message"],
                },
            },
        ],
        "config_list": config_list,
        "timeout": 60,
        "seed": 42,
    }

    for agent in [coder, pm, reviewer]:
        # update llm_config for assistant agents.
        agent.llm_config.update(llm_config)

    for agent in [boss, coder, pm, reviewer]:
        # register functions for all agents.
        agent.register_function(
            function_map={
                "retrieve_content": retrieve_content,
            }
        )

    groupchat = autogen.GroupChat(
        agents=[boss, coder, pm, reviewer], messages=[], max_round=12
    )
    manager = autogen.GroupChatManager(
        groupchat=groupchat, llm_config=llm_config)

    # Start chatting with boss as this is the user proxy agent.
    boss.initiate_chat(
        manager,
        message=problem,
    )


#norag_chat()
call_rag_chat()
