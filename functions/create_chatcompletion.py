import openai
import json
import os
from firebase_functions import https_fn

def main(req: https_fn.Request) -> https_fn.Response:
    openai.api_key = os.environ.get("OPENAI_API_KEY")
    chat_completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=req.get_json()["data"]["messages"])
    return json.dumps({"data" : chat_completion})

