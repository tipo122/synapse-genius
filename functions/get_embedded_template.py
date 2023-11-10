import logging
import json
from firebase_functions import firestore_fn, https_fn
from firebase_admin import initialize_app, firestore
from bs4 import BeautifulSoup
from lxml import etree
import matplotlib.pyplot as plt
from io import BytesIO
import numpy as np
from subprocess import check_output
from template_element_analyzer import get_template_elements

from firebase_admin import credentials, initialize_app, storage
import google.cloud.firestore
import base64
import base64
import json
from lxml import etree
from flatten_json import flatten


log = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

def main(req:https_fn.Request) -> https_fn.Response:
  params = req.get_json()["data"]
  template_id = params["template_id"]
  canvas_id = params["canvas_id"]
  values = get_creative_copies(canvas_id)
  source_blob_name = "templates/" + template_id + ".svg"
  bucket = storage.bucket()
  blob = bucket.blob(source_blob_name)

  source_svg = blob.download_as_string()
  root = etree.fromstring(source_svg)

  for id in values:
      text_tag = root.xpath(f"//*[@id='{id}']")
      if text_tag:
          text_tag[0].text = values[id]
  updated_xml_byte = etree.tostring(root, encoding='unicode', pretty_print=True)
  xml_string_encoded = updated_xml_byte.decode()
  encoded_xml = base64.b64encode(xml_string_encoded).decode()
  return json.dump({"data": encoded_xml})

def get_creative_copies(canvas_id):
  firestore_client: google.cloud.firestore.Client = firestore.client()
  doc_ref = firestore_client.collection("canvases").document(canvas_id)
  return(flatten(doc_ref.get().to_dict()["copy_data"]))