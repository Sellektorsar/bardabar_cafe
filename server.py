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
import base64
import secrets

SESSION_COOKIE_NAME = 'admin_session'
ADMIN_LOGIN = 'admin'
ADMIN_PASSWORD = 'cafe123'
sessions = set()

class BardabarHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Credentials', 'true')
        super().end_headers()
    
    def parse_cookies(self):
        cookies = {}
        cookie_header = self.headers.get('Cookie')
        if cookie_header:
            for pair in cookie_header.split(';'):
                if '=' in pair:
                    k, v = pair.strip().split('=', 1)
                    cookies[k] = v
        return cookies

    def is_admin_session(self):
        cookies = self.parse_cookies()
        session = cookies.get(SESSION_COOKIE_NAME)
        return session in sessions
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # API endpoint for admin status (cookie-based)
        if path == '/api/admin/status':
            is_admin = self.is_admin_session()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Credentials', 'true')
            self.end_headers()
            self.wfile.write(json.dumps({'isAdmin': is_admin}).encode('utf-8'))
            return
        
        # --- API endpoint for menu items (test data) ---
        if path == '/api/items':
            items = [
                {
                    "id": "1",
                    "name": "Пицца Маргарита",
                    "description": "Томатный соус, моцарелла, базилик",
                    "price": 450,
                    "imageUrl": None,
                    "articleCode": "001",
                    "categoryId": "pizza",
                    "category": {"id": "pizza", "name": "Пицца", "order": 1}
                },
                {
                    "id": "2",
                    "name": "Бургер Йорк",
                    "description": "Котлета куриная, булка белая, бекон копченый, сыр, помидор, лист салата, красный лук",
                    "price": 470,
                    "imageUrl": None,
                    "articleCode": "002",
                    "categoryId": "burgers",
                    "category": {"id": "burgers", "name": "Бургеры", "order": 2}
                }
            ]
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(items, ensure_ascii=False).encode('utf-8'))
            return
        # --- END: API endpoint for menu items ---
        
        # --- API endpoint for menu categories (test data) ---
        if path == '/api/menu/categories':
            categories = [
                {"id": "pizza", "name": "Пицца", "order": 1},
                {"id": "burgers", "name": "Бургеры", "order": 2}
            ]
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(categories, ensure_ascii=False).encode('utf-8'))
            return
        # --- END: API endpoint for menu categories ---

        # --- API endpoint for events (test data) ---
        if path == '/api/events':
            events = [
                {"id": "1", "title": "Живая музыка", "description": "Каждую пятницу и субботу!", "imageUrl": None, "date": "2025-06-20"}
            ]
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(events, ensure_ascii=False).encode('utf-8'))
            return
        # --- END: API endpoint for events ---

        # --- API endpoint for news (test data) ---
        if path == '/api/news':
            news = [
                {"id": "1", "title": "Новое меню!", "content": "Попробуйте наши новые блюда.", "imageUrl": None, "createdAt": "2025-06-10"}
            ]
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(news, ensure_ascii=False).encode('utf-8'))
            return
        # --- END: API endpoint for news ---

        # --- API endpoint for contacts (test data) ---
        if path == '/api/contacts':
            contacts = [
                {"id": "1", "name": "Иван", "phone": "+7 900 000-00-00", "message": "Забронировать стол", "type": "table", "createdAt": "2025-06-11"}
            ]
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(contacts, ensure_ascii=False).encode('utf-8'))
            return
        # --- END: API endpoint for contacts ---

        # --- API endpoint for staff (test data) ---
        if path == '/api/staff':
            staff = [
                {"id": "1", "name": "Анна Петрова", "position": "Шеф-повар", "description": "Опытный шеф-повар", "imageUrl": None, "order": 1}
            ]
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(staff, ensure_ascii=False).encode('utf-8'))
            return
        # --- END: API endpoint for staff ---

        # --- API endpoint for about (test data) ---
        if path == '/api/about':
            about = {
                "title": "О нас",
                "content": "Лучшее кафе города!",
                "advantages": [
                    {"title": "Уютная атмосфера", "description": "Приятная обстановка для всех гостей."},
                    {"title": "Вкусная еда", "description": "Широкий выбор блюд на любой вкус."}
                ]
            }
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(about, ensure_ascii=False).encode('utf-8'))
            return
        # --- END: API endpoint for about ---
        
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
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length else b''
        data = {}
        if post_data:
            try:
                data = json.loads(post_data.decode('utf-8'))
            except Exception:
                pass

        # Login endpoint
        if path == '/api/admin/login':
            login = data.get('login')
            password = data.get('password')
            if login == ADMIN_LOGIN and password == ADMIN_PASSWORD:
                session = secrets.token_hex(32)
                sessions.add(session)
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Set-Cookie', f'{SESSION_COOKIE_NAME}={session}; Path=/; HttpOnly; SameSite=Lax')
                self.send_header('Access-Control-Allow-Credentials', 'true')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True}).encode('utf-8'))
            else:
                self.send_response(401)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'message': 'Неверный логин или пароль'}).encode('utf-8'))
            return

        # Logout endpoint
        if path == '/api/admin/logout':
            cookies = self.parse_cookies()
            session = cookies.get(SESSION_COOKIE_NAME)
            if session in sessions:
                sessions.remove(session)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Set-Cookie', f'{SESSION_COOKIE_NAME}=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
            self.send_header('Access-Control-Allow-Credentials', 'true')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True}).encode('utf-8'))
            return

        # --- API endpoints for admin (POST/PUT/DELETE stub handlers) ---
        # Для PUT/DELETE можно использовать X-HTTP-Method-Override или поле _method в body
        method = self.command
        override = self.headers.get('X-HTTP-Method-Override') or data.get('_method')
        if override:
            method = override.upper()

        # Menu Categories
        if path.startswith('/api/menu/categories'):
            if method == 'POST':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Категория сохранена"}, ensure_ascii=False).encode('utf-8'))
                return
            if method == 'PUT':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Категория обновлена"}, ensure_ascii=False).encode('utf-8'))
                return
            if method == 'DELETE':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Категория удалена"}, ensure_ascii=False).encode('utf-8'))
                return

        # Menu Items
        if path.startswith('/api/items'):
            if method == 'POST':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Блюдо сохранено"}, ensure_ascii=False).encode('utf-8'))
                return
            if method == 'PUT':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Блюдо обновлено"}, ensure_ascii=False).encode('utf-8'))
                return
            if method == 'DELETE':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Блюдо удалено"}, ensure_ascii=False).encode('utf-8'))
                return

        # Events
        if path.startswith('/api/events'):
            if method == 'POST':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Мероприятие сохранено"}, ensure_ascii=False).encode('utf-8'))
                return
            if method == 'PUT':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Мероприятие обновлено"}, ensure_ascii=False).encode('utf-8'))
                return
            if method == 'DELETE':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Мероприятие удалено"}, ensure_ascii=False).encode('utf-8'))
                return

        # News
        if path.startswith('/api/news'):
            if method == 'POST':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Новость сохранена"}, ensure_ascii=False).encode('utf-8'))
                return
            if method == 'PUT':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Новость обновлена"}, ensure_ascii=False).encode('utf-8'))
                return
            if method == 'DELETE':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Новость удалена"}, ensure_ascii=False).encode('utf-8'))
                return

        # Contacts
        if path.startswith('/api/contacts'):
            if method == 'POST':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Заявка отправлена"}, ensure_ascii=False).encode('utf-8'))
                return
            if method == 'DELETE':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Заявка удалена"}, ensure_ascii=False).encode('utf-8'))
                return

        # Staff
        if path.startswith('/api/staff'):
            if method == 'POST':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Сотрудник сохранён"}, ensure_ascii=False).encode('utf-8'))
                return
            if method == 'PUT':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Сотрудник обновлён"}, ensure_ascii=False).encode('utf-8'))
                return
            if method == 'DELETE':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Сотрудник удалён"}, ensure_ascii=False).encode('utf-8'))
                return

        # About
        if path.startswith('/api/about'):
            if method == 'PUT':
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Информация обновлена"}, ensure_ascii=False).encode('utf-8'))
                return
        
        # --- END: API endpoints for admin (POST/PUT/DELETE stub handlers) ---
        
        # Остальные POST-запросы (например, формы)
        try:
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