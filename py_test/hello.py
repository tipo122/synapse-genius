#!/usr/bin/env python3
# python -m py_test.hello
import os
import sys
import json
import json

sys.path.append(os.path.join(os.path.dirname(__file__), "../functions"))

from functions.create_template_elements import call_llm, function_data, get_argument

if __name__ == "__main__":
    
    context = [
        "■■■肉本来の旨味がたっぷり凝縮！健康あか牛のステーキ５００ｇをお届け♪■■■ 柔らかさと旨味を兼ね備えた、お肉本来の味わいを堪能できる「くまもとあか牛」。その貴重なあか牛のモモステーキ（２５０ｇ／枚）がたっぷり５００ｇ！適度なサシが入った「健康あか牛」は、上質な赤身肉の旨味とマッチングした、人気のオリジナルブランド。やや弾力がありながらも、サクッと噛み切れる適度な肉質と、さっぱりジューシーな味わいお肉です。 TVやメディアでも取り上げられる、熊本名物「あか牛」１００％使用の贅沢な逸品を是非ともお召し上がり下さい♪ ■■■くまもとあか牛とは■■■ 褐毛和種（あかげわしゅ）は熊本系と高知系に分けられ、現在の「くまもとあか牛」は阿蘇、矢部および球磨地方で飼われていた在来種とシンメンタール種の交配により改良された固有種で、昭和19年に和牛として登録されました。あか牛は、耐寒・耐暑性に優れており、放牧に適し、性格がおとなしく飼育しやすいという特性を持っています。肉質は赤身が多く、適度の脂肪分も含み、うま味とやわらかさ、ヘルシーさを兼ね備えています。"
    ]
    response = call_llm(context)

    answer = response["choices"][0]["message"]
    arguments = get_argument(answer)
    if arguments:
        item_property = arguments.get("item_property")
        copy_data = arguments.get("copy_data")

        print(json.dumps(item_property, indent=2, ensure_ascii=False))
        print(json.dumps(copy_data, indent=2, ensure_ascii=False))
