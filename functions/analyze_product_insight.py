import openai
import logging
import json
import os
from firebase_functions import firestore_fn, https_fn
import requests
from bs4 import BeautifulSoup
from firebase_admin import initialize_app, firestore
import google.cloud.firestore

log = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

def main(req:https_fn) -> https_fn.Response:
    openai.api_key = os.environ.get("OPENAI_API_KEY")
    params = req.get_json()["data"]
    target_url = params["target_url"] if "target_url" in params else None
    canvas_id = params["canvas_id"] if "canvas_id" in params else None
    if target_url is None:
        return json.dumps({"data": "target_url is not in req.data"})

    firestore_client: google.cloud.firestore.Client = firestore.client()
    # return json.dumps({"data": "end"})
    item_name = ""
    item_category = ""
    item_description = ""

    result = {
        "item_property" : {
            "item_name" : item_name,
            "item_category" : item_category,
            "item_description" : item_description,
        }
    }
 
    text = fetch_webpage_text(target_url)

    messages=[
      {"role": "system", "content": """
       あなたは優秀な商品情報解析者なです。
       あなたはユーザーから、商品販売ページのコンテンツをテキストとして受け取ります
       その情報から、商品の名前をitem_nameとして、
       商品が属すると推測されるカテゴリーを item_category、
       商品のデスクリプションを item_description として、
       例として渡されたJSON形式で返却してください。
       """},
      {"role": "assistant", "content": json.dumps(result)}, 
      {"role": "user", "content": f"""
       以下の情報を参考にして、

       参考情報:{text[0:1000]}

       """}
    ]

    response = openai.ChatCompletion.create(
        messages=messages,
        model="gpt-3.5-turbo",
        max_tokens=400
    ) 
    
    result = json.loads(response["choices"][0]["message"]["content"])

    item_name = result["item_property"]["item_name"]
    item_category = result["item_property"]["item_category"]
    item_description = result["item_property"]["item_description"]

    result = {
        "item_property" : {
            "item_name" : item_name,
            "item_category" : item_category,
            "item_description" : item_description,
        }
    }
 
    doc_ref = firestore_client.collection("canvases").document(canvas_id)
    doc_ref.set(result, merge=True)

    return json.dumps({"data" : "ok"})

def fetch_webpage_text(url):
    headers = {
        'User-Agent': 'synapse genius client 0.01',
        'From': 'akih@keroling.net' 
    }
    soup = BeautifulSoup(requests.get(url, headers=headers).text, 'html.parser')
    text_parts = soup.stripped_strings
    text = " ".join(text_parts)
    
    return text

