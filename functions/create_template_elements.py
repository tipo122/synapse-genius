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
    text = asyncio.run(fetch_webpage_text(target_url))

    response = call_llm(text)

    answer = response["choices"][0]["message"]
    arguments = get_argument(answer)

    if arguments:
        try:
            result = argument_to_result(arguments, target_url, template_type)
            # result['copy_data'] = elements
            doc_ref = firestore_client.collection("canvases").document(canvas_id)
            doc_ref.set(result, merge=True)

            formatted_string = f"商品名: {result['item_property']['item_name']}\n商品カテゴリー: {result['item_property']['item_category']}\n商品の特徴: {result['item_property']['item_description']}"
            elements = get_template_elements(ad_type=template_type, context=formatted_string, canvas_id=canvas_id)

            return json.dumps({"data" : "ok"})
        except Exception:
            print("error")
            print(result.encode().decode('unicode-escape'))
            print(response)
            print(traceback.format_exc())
            print(sys.exc_info()[2])

    return json.dumps({"data" : "error"})

"""        
    try:
        content = response["choices"][0]["message"]["content"]
        item_property = json.loads(content)["item_property"]
        item_name = item_property["item_name"]
        item_category = item_property["item_category"]
        item_description = item_property["item_description"]
        formatted_string = f"商品名: {item_property['item_name']}\n商品カテゴリー: {item_property['item_category']}\n商品の特徴: {item_property['item_description']}"
        
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

        return json.dumps({"data" : "ok"})
        # return elements
        

    except Exception:
        print(content.encode().decode('unicode-escape'))
        print(response)
        print(traceback.format_exc())
        print(sys.exc_info()[2])
        return json.dumps({"data" : "error"})
"""    

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
    
    # requestUrl = "http://localhost:5000/synapse-genius-dev-fbe11/us-central1/helloWorld"
    requestUrl = os.getenv('CRAWLER_URL')
    payload = {'url': url}
    res = requests.get(url=requestUrl, data=payload)
    
    if res.status_code == 200:
        print("success")
        print("success:", res.status_code)
    else:
        print("Failed:", res.status_code)
    
    
    text_parts = soup.stripped_strings
    text = " ".join(text_parts)
    
    return text

def call_llm(text):
    messages = generate_openai_message(count=5, context=text)

    return openai.ChatCompletion.create(
        messages=messages,
        functions=function_data(),
        model="gpt-3.5-turbo",
        max_tokens=1000
    )


def function_data():
    return [{
        "name": "create_template",
        "description": "",
        "parameters": {
            "type": "object",
            "properties": {
                "item_property": {
                    "type": "object",
                    "properties": {
                        "item_name": {
                            "type": "string"
                        },
                        "item_category": {"type": "string"},
                        "item_description": {"type": "string"}
                    }
                },
                "copy_data": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "text": {"type": "string"}
                        }
                    }
                }
            }
        }
    }]



def get_argument(answer):
    function_call = answer.get("function_call")
    arguments = function_call.get("arguments")
    if arguments:
        try:
            return json.loads(arguments)
        except Exception:
             print("ERRO")
             print(arguments.encode().decode('unicode-escape'))

    return None


def argument_to_result(arguments, target_url, template_type):
    item_property = arguments.get("item_property")
    item_property["url"] = target_url

    copy_data = arguments.get("copy_data")

    result = {
        "item_property": item_property,
        "copy_data": copy_data,
        "template_property" : {
            "template_type" : template_type,
        }
    }
    return result

def generate_openai_message(count, context):
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
    # print("$#$#$#$#$")
    # print (json.dumps(response))
    return [
        {"role": "system", "content": system_message},
        # {"role": "assistant", "content": json.dumps(response)},
        {"role": "user", "content": f"以下の情報を参考にして、コピーを {count}個作成してください。参考情報:{context[0:1000]}"}
    ]

def getFunctionPath():



    # const { projectId } = app.options;
    # const { region } = functions;
    # // @ts-ignore
    # const emulator = functions.emulatorOrigin;
    # let url: string = "";

    # if (emulator) {
    #   url = `${emulator}/${projectId}/${region}/on_get_embedded_template`;
    # } else {
    #   url = `https://${region}-${projectId}.cloudfunctions.net/on_get_embedded_template`;
    # }
    # return url;
    return ""


if __name__ == "__main__":
    main()


