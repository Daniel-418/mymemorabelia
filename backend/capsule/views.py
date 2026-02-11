from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.
def project_home(request):
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Memorabelia | API Service</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 2rem; background-color: #f4f7f6; }
            .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-top: 5px solid #2c3e50; }
            h1 { color: #2c3e50; margin-top: 0; }
            .status { display: inline-block; padding: 0.25rem 0.75rem; background: #27ae60; color: white; border-radius: 50px; font-size: 0.8rem; font-weight: bold; margin-bottom: 1rem; }
            code { background: #eee; padding: 0.2rem 0.4rem; border-radius: 4px; }
            .links { margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1rem; }
            a { color: #3498db; text-decoration: none; font-weight: bold; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="status">SYSTEM OPERATIONAL</div>
            <h1>My Memorabelia API</h1>
            <p>Welcome to the backend service for <strong>My Memorabelia</strong>. This server is responsible for managing digital time capsules and scheduled deliveries.</p>
            
            <h3>Current Environment Details:</h3>
            <ul>
                <li><strong>Service:</strong> Django + Gunicorn</li>
                <li><strong>Task Runner:</strong> Celery + Redis</li>
                <li><strong>API Specification:</strong> OpenAPI 3.0 (Spectacular)</li>
            </ul>

            <div class="links">
                <p>Looking for documentation? <a href="/api/schema/swagger-ui/">Explore the Swagger UI &rarr;</a></p>
            </div>
        </div>
    </body>
    </html>
    """
    return HttpResponse(html_content)
