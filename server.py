import os
from http.server import SimpleHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn
import threading
from websocket_server import WebsocketServer

# Define the handler to serve the static files
class CustomHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

PORT = int(os.getenv('PORT', 8080))

# HTTP Server
class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""

def start_http_server():
    handler = CustomHandler
    httpd = ThreadedHTTPServer(("", PORT), handler)
    print(f"Serving HTTP on port {PORT}")
    httpd.serve_forever()

# WebSocket Server
def start_websocket_server():
    ws_port = PORT + 1

    def new_client(client, server):
        print(f"New client connected: {client['id']}")

    def client_left(client, server):
        print(f"Client disconnected: {client['id']}")

    def message_received(client, server, message):
        print(f"Message received from {client['id']}: {message}")
        server.send_message_to_all(message)

    ws_server = WebsocketServer(ws_port, host="")
    ws_server.set_fn_new_client(new_client)
    ws_server.set_fn_client_left(client_left)
    ws_server.set_fn_message_received(message_received)
    print(f"Serving WebSocket on port {ws_port}")
    ws_server.run_forever()

if __name__ == "__main__":
    # Start both servers in separate threads
    threading.Thread(target=start_http_server).start()
    threading.Thread(target=start_websocket_server).start()