import torch
import requests
import pandas as pd
import os
from PIL import Image
from io import BytesIO
import pinecone
from transformers import CLIPProcessor, CLIPModel, CLIPTokenizer
import firebase_admin
from firebase_admin import credentials, firestore
import google.cloud.firestore

def main() -> str:
    # cred_path = 'path/to/your-service-account-file.json'
    # cred = credentials.Certificate(cred_path)

    # # Firebaseアプリを初期化します。
    # firebase_admin.initialize_app(cred) 


    # Application Default credentials are automatically created.
    app = firebase_admin.initialize_app()
    db = firestore.client() 

    # Get data from firebase
    # db: google.cloud.firestore.Client = firestore.client()
    docs = db.collection("test_templates").stream()

    # Convert data into a pandas DataFrame
    data = []
    for doc in docs:
        record = doc.to_dict()
        record['doc_id'] = doc.id 
        data.append(record)

    image_data_df = pd.DataFrame(data)

    image_data_df["image"] = image_data_df["image_url"].apply(get_image)
    return 'ok'

def notmain() -> str:

    # # Get data from firebase
    # db: google.cloud.firestore.Client = firestore.client()
    # docs = db.collection("test_templates").stream()

    # # Convert data into a pandas DataFrame
    # data = []
    # for doc in docs:
    #     record = doc.to_dict()
    #     record['doc_id'] = doc.id 
    #     data.append(record)

    # image_data_df = pd.DataFrame(data)

    # image_data_df["image"] = image_data_df["image_url"].apply(get_image)

    # 画像ディレクトリのパス
    image_dir = './templates'

    # 画像ディレクトリ内のすべての.pngファイルのパスを取得
    image_files = [f for f in os.listdir(image_dir) if f.endswith('.png')]

    # 画像を読み込み、PIL.Imageオブジェクトとしてデータフレームに保存
    images = []
    doc_ids = []

    for image_file in image_files:
        image_path = os.path.join(image_dir, image_file)
        
        with Image.open(image_path).convert("RGB") as img:
            images.append(img.copy())  # PIL.Imageオブジェクトをリストに追加
        
        # ファイル名から拡張子を取り除き、doc_idsリストに追加
        doc_id = os.path.splitext(image_file)[0]
        doc_ids.append(doc_id)

    # 画像データとdoc_idを含むデータフレームを作成
    image_data_df = pd.DataFrame({'doc_id': doc_ids, 'image': images})

    print(image_data_df)

    # Set the device
    device = "cuda" if torch.cuda.is_available() else "cpu"

    model_ID = "openai/clip-vit-base-patch32"

    model, processor, tokenizer = get_model_info(model_ID, device)

    my_get_single_image_embedding = generate_image_embedding_func(processor, device, model)
    image_data_df["img_embeddings"] = image_data_df["image"].apply(my_get_single_image_embedding)

    pinecone.init(
        api_key = "503e0a23-6540-42f7-aff5-1d81075dd8fa",  # app.pinecone.io
        environment="us-west1-gcp-free"
    )

    my_index_name = "clip-image-search"
    vector_dim = image_data_df.img_embeddings[0].shape[1]

    if my_index_name not in pinecone.list_indexes():
        # Create the vectors dimension
        pinecone.create_index(name = my_index_name,
                            dimension=vector_dim,
                            metric="cosine", shards=1,
                            pod_type='s1.x1')

    # Connect to the index
    my_index = pinecone.Index(index_name = my_index_name)

    # image_data_df["vector_id"] = image_data_df.index
    # image_data_df["vector_id"] = image_data_df["vector_id"].apply(str)
    image_data_df["vector_id"] = image_data_df["doc_id"]

    # Get all the metadata
    final_metadata = []

    for index in range(len(image_data_df)):
        final_metadata.append({
            'ID':  image_data_df.iloc[index].vector_id,
            # 'caption': image_data_df.iloc[index].caption,
            # 'image': image_data_df.iloc[index].image_url
        })

    image_IDs = image_data_df.vector_id.tolist()
    image_embeddings = [arr.tolist() for arr in image_data_df.img_embeddings.tolist()]

    # Create the single list of dictionary format to insert
    data_to_upsert = list(zip(image_IDs, image_embeddings, final_metadata))

    # Upload the final data
    my_index.upsert(vectors = data_to_upsert)

    # Check index size for each namespace
    my_index.describe_index_stats()

    return "ok"

def get_image(image_URL):

    response = requests.get(image_URL)
    image = Image.open(BytesIO(response.content)).convert("RGB")

    return image

def get_model_info(model_ID, device):

  # Save the model to device
  model = CLIPModel.from_pretrained(model_ID).to(device)

  # Get the processor
  processor = CLIPProcessor.from_pretrained(model_ID)

  # Get the tokenizer
  tokenizer = CLIPTokenizer.from_pretrained(model_ID)

  # Return model, processor & tokenizer
  return model, processor, tokenizer

def get_single_text_embedding(tokenizer, model, text):

  inputs = tokenizer(text, return_tensors = "pt").to(device)

  text_embeddings = model.get_text_features(**inputs)

  # convert the embeddings to numpy array
  embedding_as_np = text_embeddings.cpu().detach().numpy()

  return embedding_as_np

def get_single_image_embedding(processor, device, model, my_image):

  image = processor(
      text = None,
      images = my_image,
      return_tensors="pt"
  )["pixel_values"].to(device)

  embedding = model.get_image_features(image)

  # convert the embeddings to numpy array
  embedding_as_np = embedding.cpu().detach().numpy()

  return embedding_as_np

def generate_image_embedding_func(processor, device, model):
    def get_single_image_embedding(my_image):
        image = processor(
            text=None,
            images=my_image,
            return_tensors="pt"
        )["pixel_values"].to(device)

        embedding = model.get_image_features(image)
        embedding_as_np = embedding.cpu().detach().numpy()
        return embedding_as_np

    return get_single_image_embedding


def get_all_images_embedding(df, img_column):

  df["img_embeddings"] = df[str(img_column)].apply(get_single_image_embedding)

  return df


if __name__ == "__main__":
    main()
