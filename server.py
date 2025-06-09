#!/usr/bin/env python3
"""
Simple HTTP server for the Bardabar Cafe website
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse, parse_qs
import json
import mimetypes

class BardabarHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Handle root path
        if path == '/':
            path = '/index.html'
        
        # Handle admin path
        if path == '/admin' or path == '/admin/':
            path = '/admin/index.html'
        
        # Set the path for the parent class
        self.path = path
        
        # Call the parent class method
        super().do_GET()
    
    def do_POST(self):
        # Handle form submissions
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            
            # Simple response for form submissions
            response = {
                'status': 'success',
                'message': 'Данные получены успешно'
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            
        except Exception as e:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            error_response = {
                'status': 'error',
                'message': 'Ошибка обработки данных'
            }
            self.wfile.write(json.dumps(error_response, ensure_ascii=False).encode('utf-8'))

def run_server(port=12000):
    """Run the development server"""
    
    # Change to the script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Create server
    with socketserver.TCPServer(("0.0.0.0", port), BardabarHandler) as httpd:
        print(f"Сервер запущен на порту {port}")
        print(f"Откройте в браузере: http://localhost:{port}")
        print(f"Админ-панель: http://localhost:{port}/admin")
        print("Для остановки нажмите Ctrl+C")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nСервер остановлен")

if __name__ == "__main__":
    port = 12000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Неверный номер порта, используется порт по умолчанию 12000")
    
    run_server(port)