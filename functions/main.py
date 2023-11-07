# Welcome to Cloud Functions for Firebase for Python!
# To get started, simply uncomment the below code or create your own.
# Deploy with `firebase deploy`

from firebase_functions import https_fn, options
from firebase_admin import initialize_app

initialize_app()

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def oncreatechatcompletion(req: https_fn.Request) -> https_fn.Response:
    import create_chatcompletion
    return https_fn.Response(create_chatcompletion.main(req))

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def on_create_copywriting(req: https_fn.Request) -> https_fn.Response:
    import create_copywriting
    return https_fn.Response(create_copywriting.main(req))

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def on_create_bgimage(req: https_fn.Request) -> https_fn.Response:
    import create_bgimage
    return https_fn.Response(create_bgimage.main(req))

@https_fn.on_request(
    timeout_sec=300, 
    memory=options.MemoryOption.GB_2,
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def on_analyze_product_insight(req: https_fn.Request) -> https_fn.Response:
    import analyze_product_insight
    return https_fn.Response(analyze_product_insight.main(req))

@https_fn.on_request(
    timeout_sec=300, 
    memory=options.MemoryOption.GB_2,
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def on_analyze_product_insight2(req: https_fn.Request) -> https_fn.Response:
    import analyze_product_insight2
    return https_fn.Response(analyze_product_insight2.main(req))

@https_fn.on_request(
    timeout_sec=300, 
    memory=options.MemoryOption.GB_2,
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def on_search_template(req: https_fn.Request) -> https_fn.Response:
    import search_template
    return https_fn.Response(search_template.main(req))

@https_fn.on_request(
    timeout_sec=3000, 
    memory=options.MemoryOption.GB_2,
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def on_create_template_elements(req: https_fn.Request) -> https_fn.Response:
    import create_template_elements
    return https_fn.Response(create_template_elements.main(req))

@https_fn.on_request(
    timeout_sec=300, 
    memory=options.MemoryOption.GB_2,
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get", "post"])
)
def on_get_embedded_template(req: https_fn.Request) -> https_fn.Response:
    import get_embedded_template
    return https_fn.Response(get_embedded_template.main(req))