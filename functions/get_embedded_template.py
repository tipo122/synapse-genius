import logging
import json
from firebase_functions import firestore_fn, https_fn
from firebase_admin import initialize_app, firestore
from bs4 import BeautifulSoup


from subprocess import check_output
from template_element_analyzer import get_template_elements

from firebase_admin import credentials, initialize_app, storage



log = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)

def main(req:https_fn.Request) -> https_fn.Response:
  template_id = req.args["template_id"]

  source_blob_name = "templates/" + template_id + ".svg"
  bucket = storage.bucket()
  blob = bucket.blob(source_blob_name)
  return blob.download_as_text()