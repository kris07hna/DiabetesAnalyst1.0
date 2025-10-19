"""
Vercel Serverless Entry Point
Optimized for fast cold starts and minimal memory usage
"""
from app import app

# Export for Vercel serverless
def handler(request):
    """Serverless handler for Vercel"""
    return app(request.environ, lambda *args: None)

# Support both serverless and WSGI
application = app
