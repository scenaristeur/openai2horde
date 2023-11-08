# curl https://api.openai.com/v1/chat/completions \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer $OPENAI_API_KEY" \
#   -d '{
#      "model": "gpt-3.5-turbo",
#      "messages": [{"role": "user", "content": "Say this is a test!"}],
#      "temperature": 0.7
#    }'

# curl http://localhost:5678/v1/chat/completions \
# -H "Content-Type: application/json" \
# -H "Authorization: Bearer $OPENAI_API_KEY" \
# -d '{
#      "model": "gpt-3.5-turbo",
#      "messages": [{"role": "system", "content": "You are a helpful assistant."},{"role": "user", "content": "Knock knock."}, {"role": "assistant", "content": "Who s there?"}, {"role": "user", "content": "Orange."}],
#      "temperature": 0.7
# }'

curl http://localhost:5678/v1/chat/completions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
     "model": "gpt-3.5-turbo",
     "messages": [{"role": "system", "content": "You are a helpful assistant."},{"role": "user", "content": "Knock knock."}, {"role": "assistant", "content": "Who s there?"}, {"role": "user", "content": "Orange."}],
     "temperature": 0.7
}'


# curl http://localhost:5678/v1/chat/completions \
#   -H "Content-Type: application/json" \
#   #-H "Authorization: Bearer $OPENAI_API_KEY" \
#   -d '{
#      "model": "gpt-3.5-turbo",
#        "messages":[
#         {"role": "system", "content": "You are a helpful assistant."},
#         {"role": "user", "content": "Knock knock."},
#         {"role": "assistant", "content": "Who's there?"},
#         {"role": "user", "content": "Orange."}
#     ],
#     "temperature":0
#     }'

# curl http://localhost:5678/v1/chat/completions \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer $OPENAI_API_KEY" \
#   -d '{
#      "model": "gpt-3.5-turbo",
#         "messages":[{"role": "system", "content": "You are a helpful assistant."},
#          {"role": "user", "content": "Knock knock."},
#          {"role": "assistant", "content": "Who's there?"},
#          {"role": "user", "content": "Orange."}
#      ],
#      "temperature": 0.7
#    }'