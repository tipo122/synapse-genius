import torch
import requests
import json
import pandas as pd
import os
from PIL import Image
from io import BytesIO
import pinecone
from transformers import CLIPProcessor, CLIPModel, CLIPTokenizer
from firebase_admin import initialize_app, firestore
import google.cloud.firestore
from firebase_functions import https_fn



# def main(req: https_fn.Request) -> str:
def main(req: https_fn.Request) -> https_fn.Response:


    # Set the device
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model_ID = "openai/clip-vit-base-patch32"
    model, processor, tokenizer = get_model_info(model_ID, device)

    # Extract parameters from the request. In this case, we are expecting a parameter named "text_query".
    request_data = req.get_json()
    text_query = request_data.get('text_query')
    category = request_data.get('category')
    if not text_query:
        text_query = "instagram template for product comparison"
    
    if not category:
        category = 'comparison'

    # Get the caption embedding
    my_get_single_text_embedding = generate_text_embedding_func(tokenizer, device, model)
    query_embedding = my_get_single_text_embedding(text_query)
    query_embedding_list = query_embedding.tolist()

    # 環境変数からAPIキーを取得
    pinecone_api_key = os.environ.get("PINECONE_API_KEY")
    # pinecone_api_key = os.environ.get("5fc0462b-b467-4fbb-be3a-ab05bcbbab7b")
    pinecone.init(
        api_key = pinecone_api_key,  # app.pinecone.io
        environment="us-west1-gcp-free"
    )

    my_index_name = "clip-image-search"
    vector_dim = query_embedding.shape[1]

    if my_index_name not in pinecone.list_indexes():
        # Create the vectors dimension
        pinecone.create_index(name = my_index_name,
                            dimension=vector_dim,
                            metric="cosine", shards=1,
                            pod_type='s1.x1')

    # Connect to the index
    my_index = pinecone.Index(index_name = my_index_name)

  

    # Run the query
    result = my_index.query(
        vector = query_embedding_list,
        filter={
            "category": {"$eq": category}
        },
        top_k=4,
        include_metadata=True
    )
    # idsを文字列型のリストに変換
    ids = [str(match['id']) for match in result['matches']]

    print(ids)

    # return ids
    return json.dumps({"data" : ids})

def get_model_info(model_ID, device):

  # Save the model to device
  model = CLIPModel.from_pretrained(model_ID).to(device)

  # Get the processor
  processor = CLIPProcessor.from_pretrained(model_ID)

  # Get the tokenizer
  tokenizer = CLIPTokenizer.from_pretrained(model_ID)

  # Return model, processor & tokenizer
  return model, processor, tokenizer

def generate_text_embedding_func(tokenizer, device, model):
    def get_single_text_embedding(my_text):
        inputs = tokenizer(my_text, return_tensors = "pt").to(device)

        text_embeddings = model.get_text_features(**inputs)

        # convert the embeddings to numpy array
        embedding_as_np = text_embeddings.cpu().detach().numpy()

        return embedding_as_np
   
    return get_single_text_embedding


class DummyRequest:
    def __init__(self, data):
        self.data = data

    def get_json(self):
        # get_jsonメソッドが呼ばれたときに、初期化時のデータを返す
        return self.data

if __name__ == "__main__":
    # テスト用のダミーリクエストデータを作成
    dummy_data = {
        'text_query': 'Instagram template to introduce new products',  # テスト用のクエリテキスト
        'category': 'new'     # テスト用のカテゴリ
    }

    # ダミーリクエストオブジェクトの作成
    req = DummyRequest(dummy_data)

    # ダミーリクエストでmain関数を実行
    main(req)


