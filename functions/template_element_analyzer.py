import openai
import sys
import json
import os
from dotenv import load_dotenv
from firebase_functions import firestore_fn, https_fn
from firebase_admin import initialize_app, firestore
import google.cloud.firestore


load_dotenv()

# def main(req:https_fn) -> https_fn.Response:
def main():
    context =  """\
        商品名: Full Cover Bikini
        商品カテゴリー: 男性用下着
        商品の特徴:素肌に直接触れる下着のために独自に開発した素材「nova wool® melty plus」を使用。汗蒸れ・汗冷え・汗臭を解消する消臭・抗菌機能に加え、素肌を清潔かつ快適に保つ調温・調湿機能に長けています。素肌へのストレスをクリアにし、第二の肌となってあなたの活動を支えます。食い込まないを追求した設計がストレスゼロな着用感を実現。
        """
    get_template_elements("feature", context=context)

def get_template_elements(ad_type, context, canvas_id) -> str:

    openai.api_key = os.getenv('OPENAI_API_KEY')

    firestore_client: google.cloud.firestore.Client = firestore.client()
   
    context_info = context.encode('unicode-escape')
    
    prompt = create_advertisement_prompt(ad_type, context_info)

    prompts = [
        {"role": "system", "content": """\
         あなたは自社のinstagram広告の作成担当者です。
         ユーザーから依頼された広告を作成してください。
         あなたはユーザーから、広告を作成するためのいくつかの情報受け取ります。
         その情報からinstagramの広告を作成して、その要素をJSONの形式で返却してください。
         """},
        {"role": "user", "content": prompt}
    ]

    response = call_llm(prompts, ad_type)
    answer = response["choices"][0]["message"]
    arguments = get_argument(answer)

    if arguments:
        try:
            result = argument_to_result(arguments, ad_type)
            print(json.dumps(result))

            doc_ref = firestore_client.collection("canvases").document(canvas_id)
            doc_ref.set(result, merge=True)

            return json.dumps(result)
        except Exception:
            print("error")
    return json.dumps({"data" : "error"})

def create_advertisement_prompt(ad_type, context_info):
    """
    指定された広告タイプに基づいて、広告メッセージを作成します。

    :param ad_type: 広告のタイプ（例：'comparison', 'feature', 'sale'など）。
    :param context_info: 広告内容を作成するためのコンテキスト情報。
    :return: 広告メッセージのリスト。
    """
    # 広告のタイプに基づいてメッセージのテンプレートを選択
    if ad_type == "comparison":
        # 比較広告のテンプレート
        template = """\
        以下の情報を参考にして、自社商品と他社商品の比較広告を作成してください。
        
        参考情報としてあるのは自社商品の情報のみです。

        自社製品名、自社製品の特徴1〜3は参考情報を参考に作成してください。
        簡潔にまとめることを心がけてください。

        他社製品名、他社製品の特徴1〜3は、自社製品の情報から類推して作成してください。
        自社製品に対して劣っている表現や、自社製品に対してネガティブな表現が好ましいです。
        簡潔にまとめることを心がけてください。

         広告には以下の項目を含みます。

        ・自社製品名（ourProductName）
        ・自社製品の特徴1（ourProductFeature1）
        ・自社製品の特徴2（ourProductFeature2）
        ・自社製品の特徴3（ourProductFeature3）
        ・他社製品名（otherProductName）
        ・（自社製品の特徴1の対義語となる）他社製品の特徴1（otherProductFeature1）
        ・（自社製品の特徴1の対義語となる）他社製品の特徴2（otherProductFeature2）
        ・（自社製品の特徴1の対義語となる）他社製品の特徴3（otherProductFeature3）

        自社製品の特徴1、自社製品の特徴2、自社製品の特徴3、他社製品の特徴1、他社製品の特徴2、他社製品の特徴3はそれぞれ12文字以内で作成してください。

        参考情報:{context_info}
        """  
    elif ad_type == "feature":
        # 特徴広告のテンプレート
        template = """\
        以下の情報を参考にして、自社の商品を紹介する広告を作成してください。
        簡潔にまとめることを心がけてください。
        広告には以下の項目を含みます。

        ・商品名（ourProductName）
        ・商品の特徴1（ourProductFeature1）
        ・商品の特徴2（ourProductFeature2）
        ・商品の特徴3（ourProductFeature3）
        ・商品の特徴4（ourProductFeature4）
        ・商品の特徴5（ourProductFeature5）
        ・商品の特徴の要約（ourProductFeaturesSummary） 

        商品の特徴1、商品の特徴2、商品の特徴3、商品の特徴4、商品の特徴5はそれぞれ12文字以内で作成してください。

        参考情報:{context_info}
        """  
    elif ad_type == "sale":
        # セール広告のテンプレート
        template = """\
        以下の情報を参考にして、セール広告を作成してください。
        セール広告には以下の項目を含みます。季節感や時期を考慮して作成してください。

        ・メインのタイトル（title）
        ・メインのメッセージ(message)
        ・セール期間(period)

        参考情報:{context_info}
        """  
    else:
        return ""  # 不明な広告タイプの場合は空のリストを返す

    # テンプレートにコンテキスト情報を注入
    prompt = template.format(context_info=context_info)

    # 作成されたメッセージを含むリストを返す
    return prompt

def create_sample_json_string(ad_type):
    """
    指定された広告タイプに基づいて、広告内容のJSONを作成します。

    :param ad_type: 広告のタイプ（例：'comparison', 'feature', 'sale'など）。
    :return: 広告内容のJSON。
    """

    # 広告のタイプに基づいてJSONの内容を動的に変更
    if ad_type == "comparison":
        # 比較広告用のフィールドを追加/更新
        sample_json = """
            {
                "ourProductName": "シェイクパック",
                "ourProductFeature1": "シェーカーなしで飲める",
                "ourProductFeature2": "個包装タイプだから持ち運びも簡単",
                "ourProductFeature3": "女性が1食に必要な33種類の栄養素がたっぷり", 
                "otherProductName": "プロテインA",
                "otherProductFeature1": "シェーカーが必要",
                "otherProductFeature2": "大袋で持ち運びが難しい",
                "otherProductFeature3": "男性向け"
            }
        """
    elif ad_type == "feature":
        sample_json = """
            {
                "productName": "シェイクパック",
                "feature1": "シェーカーなしで飲める",
                "feature2": "個包装タイプだから持ち運びも簡単",
                "feature3": "女性が1食に必要な33種類の栄養素がたっぷり",
                "feature4": "大豆由来の植物性ウェルネスプロテイン",
                "feature5": "砂糖と人工甘味料は不使用",
                "featuresSummary": "“シェーカーなし”でおいしく飲むことができる個包装タイプのプロテイン『シェイクパック』。女性が1食に必要な33種類の栄養素がたっぷり入った大豆由来の植物性ウェルネスプロテインを、いつでもどこでも手軽に飲むことができます。"
            }
        """
    elif ad_type == "sale":
        sample_json = """
            {
                "title": "冬のフラッシュセール",
                "message": "超ホットな最新アイテム",
                "period": "2021-12-24～2021-12-31",
            }
        """
    else:
        # 不明な広告タイプの場合はエラーを表示または空のJSONを返す
        return ""

    return sample_json

def create_advertisement_json(ad_type, product_info):
    """
    指定された広告タイプに基づいて、広告内容のJSONを作成します。

    :param ad_type: 広告のタイプ（例：'comparison', 'feature', 'sale'など）。
    :param product_info: 商品に関する情報や広告内容に必要なその他の情報。
    :return: 広告内容のJSON。
    """
    # 基本的なJSON構造を定義
    ad_json_structure = {
        "product": {
            "name": product_info.get("name"),
            # その他の共通フィールド...
        },
        # 広告タイプに特有のフィールド...
    }

    # 広告のタイプに基づいてJSONの内容を動的に変更
    if ad_type == "comparison":
        # 比較広告用のフィールドを追加/更新
        ad_json_structure.update({
            "comparison": {
                # 比較に必要なフィールド...
            }
        })
    elif ad_type == "feature":
        # 特徴広告用のフィールドを追加/更新
        ad_json_structure.update({
            "feature": {
                # 特徴に関するフィールド...
            }
        })
    elif ad_type == "sale":
        # セール広告用のフィールドを追加/更新
        ad_json_structure.update({
            "sale": {
                # セール情報に関するフィールド...
            }
        })
    else:
        # 不明な広告タイプの場合はエラーを表示または空のJSONを返す
        return {}

    return ad_json_structure

def call_llm(messages, ad_type):
  

    return openai.ChatCompletion.create(
        messages=messages,
        functions=function_data(ad_type),
        model="gpt-3.5-turbo",
        max_tokens=1000
    )

def function_data(ad_type):

    if ad_type == "comparison":
        return [{
            "name": "get_template_elements",
            "description": "",
            "parameters": {
                "type": "object",
                "properties": {
                    "ourProductName": {"type": "string", "description": "自社製品名"},
                    "ourProductFeature1": {"type": "string", "description": "自社製品の特徴1"},
                    "ourProductFeature2": {"type": "string", "description": "自社製品の特徴2"},
                    "ourProductFeature3": {"type": "string", "description": "自社製品の特徴3"},
                    "otherProductName": {"type": "string", "description": "他社製品名"},
                    "otherProductFeature1": {"type": "string", "description": "他社製品の特徴1"},
                    "otherProductFeature2": {"type": "string", "description": "他社製品の特徴2"},
                    "otherProductFeature3": {"type": "string", "description": "他社製品の特徴3"},
                }
            }
        }]

    if ad_type == "feature":
        return [{
            "name": "get_template_elements",
            "description": "",
            "parameters": {
                "type": "object",
                "properties": {
                    "productName": {"type": "string", "description": "商品名"},
                    "feature1": {"type": "string", "description": "商品の特徴1"},
                    "feature2": {"type": "string", "description": "商品の特徴2"},
                    "feature3": {"type": "string", "description": "商品の特徴3"},
                    "feature4": {"type": "string", "description": "商品の特徴4"},
                    "feature5": {"type": "string", "description": "商品の特徴5"},
                    "featuresSummary": {"type": "string", "description": "商品の特徴1〜5の要約"},
                }
            }
        }]
    
    else:
        return [{
            "name": "get_template_elements",
            "description": "",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {"type": "string", "description": "メインのタイトル"},
                    "message": {"type": "string", "description": "メインのメッセージ"},
                    "period": {"type": "string", "description": "セール期間"},
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
    return None


def argument_to_result(arguments, ad_type):

    if ad_type == "comparison":
        ourProductName = arguments.get("ourProductName")
        ourProductFeature1 = arguments.get("ourProductFeature1")
        ourProductFeature2 = arguments.get("ourProductFeature2")
        ourProductFeature3 = arguments.get("ourProductFeature3")
        otherProductName = arguments.get("otherProductName")
        otherProductFeature1 = arguments.get("otherProductFeature1")
        otherProductFeature2 = arguments.get("otherProductFeature2")
        otherProductFeature3 = arguments.get("otherProductFeature3")

        result = {
            "embed_data": {
                "ourProductName": ourProductName,
                "ourProductFeature1": ourProductFeature1,
                "ourProductFeature2": ourProductFeature2,
                "ourProductFeature3": ourProductFeature3,
                "otherProductName": otherProductName,
                "otherProductFeature1": otherProductFeature1,
                "otherProductFeature2": otherProductFeature2,
                "otherProductFeature3": otherProductFeature3
            }
        }
        return result

    if ad_type == "feature":
        productName = arguments.get("productName")
        feature1 = arguments.get("feature1")
        feature2 = arguments.get("feature2")
        feature3 = arguments.get("feature3")
        feature4 = arguments.get("feature4")
        feature5 = arguments.get("feature5")
        featuresSummary = arguments.get("featuresSummary")

        result = {
            "embed_data": {
                "productName": productName,
                "feature1": feature1,
                "feature2": feature2,
                "feature3": feature3,
                "feature4": feature4,
                "feature5": feature5,
                "featuresSummary": featuresSummary
            }
        }
        return result
    
    else:
        title = arguments.get("title")
        message = arguments.get("message")
        period = arguments.get("period")

        result = {
            "embed_data": {
                "title": title,
                "message": message,
                "period": period,
            }
        }
        return result






if __name__ == "__main__":
    main()
