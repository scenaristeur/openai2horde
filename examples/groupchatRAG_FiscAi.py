from autogen import AssistantAgent, UserProxyAgent, config_list_from_json
import autogen

# Load LLM inference endpoints from an env variable or a file
# See https://microsoft.github.io/autogen/docs/FAQ#set-your-api-endpoints
# and OAI_CONFIG_LIST_sample
config_list = config_list_from_json(env_or_file="OAI_CONFIG_LIST")


from autogen.agentchat.contrib.retrieve_user_proxy_agent import RetrieveUserProxyAgent
from autogen import AssistantAgent
import chromadb

llm_config = {
    "timeout": 60,
    "seed": 12,
    "config_list": config_list,
    "temperature": 0,
    "use_cache": False
}

# autogen.ChatCompletion.start_logging()
termination_msg = lambda x: isinstance(x, dict) and "TERMINATE" == str(x.get("content", ""))[-9:].upper()

boss = autogen.UserProxyAgent(
    name="Boss",
    is_termination_msg=termination_msg,
    human_input_mode="TERMINATE",
    system_message="The boss who ask questions and give tasks.",
    code_execution_config=False,  # we don't want to execute code in this case.
)

boss_aid = RetrieveUserProxyAgent(
    name="Boss_Assistant",
    is_termination_msg=termination_msg,
    system_message="Assistant who has extra content retrieval power for solving difficult problems.",
    human_input_mode="TERMINATE",
    max_consecutive_auto_reply=3,
    retrieve_config={
        "task": "code",
        "docs_path": "https://www.legifrance.gouv.fr/download/file/pdf/LEGITEXT000006069577.pdf/LEGI",
        "chunk_token_size": 1000,
        "model": config_list[0]["model"],
        "client": chromadb.PersistentClient(path="../chromadb/Fiscai"),
        "collection_name": "groupchat",
        "get_or_create": True,
    },
    code_execution_config=False,  # we don't want to execute code in this case.
)

coder = AssistantAgent(
    name="Senior_Python_Engineer",
    is_termination_msg=termination_msg,
    system_message="You are a senior python engineer. Reply `TERMINATE` in the end when everything is done.",
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

#PROBLEM = "Comment sont imposés les revenus fonciers ?"
PROBLEM = "Comment sont les taux d'imposition pour les traitements et salaires ?"

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
    manager = autogen.GroupChatManager(groupchat=groupchat, llm_config=llm_config)

    # Start chatting with boss_aid as this is the user proxy agent.
    boss_aid.initiate_chat(
        manager,
        problem=PROBLEM,
        n_results=3,
    )

def norag_chat():
    _reset_agents()
    groupchat = autogen.GroupChat(
        agents=[boss, coder, pm, reviewer], messages=[], max_round=12
    )
    manager = autogen.GroupChatManager(groupchat=groupchat, llm_config=llm_config)

    # Start chatting with boss as this is the user proxy agent.
    boss.initiate_chat(
        manager,
        message=PROBLEM,
    )

def call_rag_chat():
    _reset_agents()
    # In this case, we will have multiple user proxy agents and we don't initiate the chat
    # with RAG user proxy agent.
    # In order to use RAG user proxy agent, we need to wrap RAG agents in a function and call
    # it from other agents.
    def retrieve_content(message, n_results=3):
        boss_aid.n_results = n_results  # Set the number of results to be retrieved.
        # Check if we need to update the context.
        update_context_case1, update_context_case2 = boss_aid._check_update_context(message)
        if (update_context_case1 or update_context_case2) and boss_aid.update_context:
            boss_aid.problem = message if not hasattr(boss_aid, "problem") else boss_aid.problem
            _, ret_msg = boss_aid._generate_retrieve_user_reply(message)
        else:
            ret_msg = boss_aid.generate_init_message(message, n_results=n_results)
        return ret_msg if ret_msg else message
    
    boss_aid.human_input_mode = "NEVER" # Disable human input for boss_aid since it only retrieves content.
    
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
    manager = autogen.GroupChatManager(groupchat=groupchat, llm_config=llm_config)

    # Start chatting with boss as this is the user proxy agent.
    boss.initiate_chat(
        manager,
        message=PROBLEM,
    )


norag_chat()