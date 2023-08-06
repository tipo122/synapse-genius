import openai
from firebase_functions import https_fn

def main(req: https_fn.Request) -> https_fn.Response:
    openai.api_key = StringParam("OPENAI_API_KEY")
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
    }
    # if req.method == 'OPTIONS':
    #     headers = {
    #         'Access-Control-Allow-Origin': '*',
    #         'Access-Control-Allow-Methods': 'GET',
    #         'Access-Control-Allow-Headers': 'Content-Type',
    #         'Access-Control-Max-Age': '3600',
    #     }
    #     return ('', 204, headers)

    # Set CORS headers for main requests
    # headers = {
    #     'Access-Control-Allow-Origin': '*',
    # }
    chat_completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=req.body.data)
    # return (json.dumps({'status': 'sucess'}), 200, headers)
    # return https_fn.Response(chat_completion.choices[0].message.content)
    return https_fn.Response(chat_completion.choices[0].message.content, 200, headers)
