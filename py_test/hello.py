#!/usr/bin/env python3
# python -m py_test.hello
import os
import sys
import json

sys.path.append(os.path.join(os.path.dirname(__file__), "../functions"))

from functions.create_template_elements import generate_openai_message 

if __name__ == "__main__":
    
    count = 5
    response = {}
    context = []
    res = generate_openai_message(count, response, context)

    print(json.dumps(res, indent=2, ensure_ascii=False));
