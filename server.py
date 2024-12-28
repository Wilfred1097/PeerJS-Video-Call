import os
from http.server import SimpleHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn
import threading

PORT = int(os.getenv('PORT', 8080))

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""

handler = SimpleHTTPRequestHandler
httpd = ThreadedHTTPServer(("", PORT), handler)

print(f"Serving on port {PORT}")
httpd.serve_forever()