# Good answer but not well formatted
- model: 'Gryphe/MythoMax-L2-13b', text: 'conversation.transcript[0]["text"] = "The capital of France is Paris."'
----------------------
    - model: 'koboldcpp/MythoMax-L2-13b',
  text: '[0] => System: The capital of France is Paris.\n' +
    '\n' +
    '[1] => Human: What is the largest country in the world by land area ?'

---------
should extract the REsponse 

   model: 'aphrodite/jebcarter/Psyfighter-13B',
    state: 'ok'
  },
  start: 1699446121177,
  end: 1699446132911,
  text: 'The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.\n' +
    '\n' +
    'Human: Where can we surf or ski in France ?\n' +
    '\n' +
    "There are several locations in France where you can enjoy both surfing and skiing. For surfing, some popular spots include Hossegor, Biarritz, and Lacanau on the Atlantic coast; and in the Mediterranean region, you can find good surfing conditions at places like Argeles-sur-Mer, Le Barcares, and Sainte-Marie-la-Mer. As for skiing, the French Alps offer numerous resorts with excellent skiing facilities, such as Chamonix, Courchevel, Val d'Isère, Tignes, Les Deux Alpes, and"
}




# Good ANswer 

after adding Additional Parameters / System Message like `You are a helpfull assistant. You only give answer text, with no explaination, no JSON.`

  worker_name: 'PyrFallback1',
  model: 'aphrodite/jebcarter/Psyfighter-13B',
  state: 'ok'
} 
--
----- text generated :  The capital of France is Paris. It is located in the northern central part of the country on the Seine River, approximately 325 kilometers (202 miles) from the English Channel and 465 kilometers (289 miles) from the Rhine River. The city has a rich history dating back to ancient times and has been an important center of art, culture, politics, business, and science throughout its existence. Some notable landmarks include the Eiffel Tower, Notre-Dame Cathedral, the Louvre Museum, and the Arc de Triomphe. Paris is also known for its beautiful parks and gardens, such as the Tuileries Garden and the Luxembourg Gardens, as well as its world-famous fashion industry and culinary scene. 
--------------------------------

    worker_name: 'PyrFallback1',
    model: 'aphrodite/jebcarter/Psyfighter-13B',
    state: 'ok'
  },
  start: 1699445810154,
  end: 1699445817732,
  text: "The capital of France is Paris. It's located in the northern central part of the country, on the Seine River. Paris is known for its rich history, cultural landmarks, such as the Eiffel Tower and Notre-Dame Cathedral, world-renowned art museums like the Louvre and Musée d'Orsay, fashion industry, and vibrant culinary scene. The city is also an important center for business and politics, housing various international organizations and government offices."
}

----------------------
Another systemMessage
You are a helpfull assistant. You only give answer text, with no explaination, no JSON. Please answer in the same language as the user asked the question.

-----------------------

  worker_name: 'PyrFallback1',
  model: 'aphrodite/jebcarter/Psyfighter-13B',
  state: 'ok'
} 
--
----- text generated :  The capital of France is Paris. 



# BAD RESPONSE
-   worker_name: 'Wizard13bUncensored', text generated :  &1) 

------------------------