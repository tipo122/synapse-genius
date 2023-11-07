import openai
import logging
import json
import os
from dotenv import load_dotenv
from firebase_functions import firestore_fn, https_fn
from firebase_admin import initialize_app, firestore
import requests
from bs4 import BeautifulSoup

import google.cloud.firestore
import asyncio

from subprocess import check_output
from template_element_analyzer import get_template_elements


log = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

load_dotenv()

def main(req:https_fn) -> https_fn.Response:
#def main():
    # print(' '.join(Launcher().cmd))
    # return json.dumps({"data": "target_url is not in req.data"})
    try:
        out = check_output('apt-get -y install libx11-xcb1 libxcb1 libxcursor1 libxss1 libxtst6 libgtk-3-0 libgdk-pixbuf2.0-0')
        print(out)
        out = check_output("ldd /root/.local/share/pyppeteer/local-chromium/588429/chrome-linux/chrome  | grep 'not found'", shell = True)
        print(out)
    except Exception as err:
        print(err)

    openai.api_key = os.getenv('OPENAI_API_KEY')
    params = req.get_json()["data"]
    target_url = params["target_url"] if "target_url" in params else None
    canvas_id = params["canvas_id"] if "canvas_id" in params else None
    template_type = params["template_type"] if "template_type" in params else None
    # target_url = "https://koredake.co.jp/shop/products/1-5-7-1"
    # target_url = "https://onenova.jp/products/nova-wool-r-breezy-plus-flexible-t-shirt-unisex?variant=40225241432166"
    # canvas_id = "Dh6KojNF8kKsDYbjLki9"
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
        },
        "copy_data"  :  [
          {"text": "Everybody Hurts"},
          {"text": "Nothing Compares 2 U"},
          {"text": "Tears in Heaven"},
          {"text": "Hurt"},
          {"text": "Yesterday"}
        ]
    }
 
    text = asyncio.run(fetch_webpage_text(target_url))

    messages = generate_openai_message(count=5, response=result, context=text)

    response = openai.ChatCompletion.create(
        messages=messages,
        model="gpt-3.5-turbo",
        max_tokens=1000
    )
    
    

    try:
        result = json.loads(response["choices"][0]["message"]["content"])
        # result = json.loads(response)["choices"][0]["message"]["content"]

        item_name = result["item_property"]["item_name"]
        item_category = result["item_property"]["item_category"]
        item_description = result["item_property"]["item_description"]
        copy_data = result["copy_data"]
        
        item_data = result['item_property']
        formatted_string = f"商品名: {item_data['item_name']}\n商品カテゴリー: {item_data['item_category']}\n商品の特徴: {item_data['item_description']}"
        
        # 
        elements = get_template_elements(ad_type=template_type, context=formatted_string)

        result = {
            "item_property" : {
                "item_url" : target_url,
                "item_name" : item_name,
                "item_category" : item_category,
                "item_description" : item_description,
            },
            "copy_data" : elements,
            "template_property" : {
                "template_type" : template_type,
            }
        }

        print(template_type)

        print("firestoer set data")

        doc_ref = firestore_client.collection("canvases").document(canvas_id)
        doc_ref.set(result, merge=True)

        print(result)

        print(elements)

        return json.dumps({"data" : "ok"})
        # return elements
        

    except:
        import traceback
        traceback.print_exc()
        return json.dumps({"data" : "error"})
    

async def fetch_webpage_text(url):
    # browser = await launch(
    #     headless=True,
    #     handleSIGINT=False,
    #     handleSIGTERM=False,
    #     handleSIGHUP=False,
    #     logLevel=0,
    #     args=[
    #         '--no-sandbox',
    #         '--single-process',
    #         '--disable-dev-shm-usage',
    #         '--disable-gpu',
    #         '--no-zygote'
    #     ],
    # )
    # page = await browser.newPage()
    # await page.goto(url)
    # source = await page.content()
    # await browser.close()

    headers = {
        'User-Agent': 'synapse genius client 0.01',
        'From': 'akih@keroling.net' 
    }
    soup = BeautifulSoup(requests.get(url, headers=headers).text, 'html.parser')
    # client = ScrapingBeeClient(api_key=sb_api_key)
    # response = client.get(url)
    # soup = BeautifulSoup(source, 'html.parser')
    text_parts = soup.stripped_strings
    text = " ".join(text_parts)
    
    return text

def generate_openai_message(count, response, context):
    system_message = """
        あなたは優秀なコピーライターです。
        あなたはユーザーから、商品販売ページのコンテンツをテキストとして受け取ります。
        その情報から、商品の名前をitem_nameとして、
        商品が属すると推測されるカテゴリーを item_category、
        商品の特徴の説明を item_description として、
        その情報からインスタグラムの広告で使えるようなキャッチーなコピーを
        copy_dataの中に配列として返してください。
        item_descriptionは、100文字以内にしてください。
    """
    print("$#$#$#$#$")
    print (json.dumps(response))
    return [
        {"role": "system", "content": system_message},
        {"role": "assistant", "content": json.dumps(response)},
        {"role": "user", "content": f"以下の情報を参考にして、コピーを {count}個作成してください。参考情報:{context[0:1000]}"}
    ]

if __name__ == "__main__":
    main()


