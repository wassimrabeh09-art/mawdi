# موعدي - Python REST API Backend Server (Doctolib Tunisia)
# Uses built-in Python http.server module (No extra pip dependencies required!)

import json
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler

import os

PORT = 4000

def load_json_file(possible_paths, fallback):
    for p in possible_paths:
        if os.path.exists(p):
            try:
                with open(p, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                print(f"[DataLoader] Error reading {p}: {e}")
    return fallback

doctors_data = load_json_file([
    os.path.join("pages", "Doctors_pages", "doctors.json"),
    os.path.join("data", "doctors.json")
], [])

admin_data = load_json_file([
    os.path.join("pages", "Admin_pages", "admin-db.json"),
    os.path.join("data", "admin-db.json")
], {"pharmacies": [], "users": []})

patients_data = load_json_file([
    os.path.join("pages", "Patients_pages", "patients-queue.json"),
    os.path.join("data", "patients-queue.json")
], {"queueEntries": [], "delayMinutes": 0})

# In-Memory Database Registry
DB = {
    "doctors": doctors_data or [],
    "pharmacies": admin_data.get("pharmacies", []),
    "users": admin_data.get("users", []),
    "appointments": [],
    "queueEntries": patients_data.get("queueEntries", []),
    "delayMinutes": patients_data.get("delayMinutes", 0)
}

class موعديRequestHandler(SimpleHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _send_json(self, data, status=200):
        self.send_response(status)
        self._send_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query = urllib.parse.parse_qs(parsed_url.query)

        if path == "/api/health":
            self._send_json({"status": "HEALTHY", "app": "موعدي Python Backend REST API", "version": "1.0.0"})

        elif path == "/api/doctors":
            specialty = query.get("specialty", [None])[0]
            city = query.get("city", [None])[0]
            keyword = query.get("keyword", [None])[0]

            filtered = DB["doctors"]
            if specialty and specialty != 'all':
                filtered = [d for d in filtered if d.get("specialtyId") == specialty]
            if city and city != 'all':
                filtered = [d for d in filtered if city.lower() in d.get("city", "").lower()]
            if keyword:
                kw = keyword.lower()
                filtered = [d for d in filtered if kw in d.get("name", "").lower() or kw in d.get("address", "").lower() or kw in d.get("specialtyFr", "").lower()]

            self._send_json({"success": True, "count": len(filtered), "data": filtered})

        elif path == "/api/pharmacies":
            self._send_json({"success": True, "count": len(DB["pharmacies"]), "data": DB["pharmacies"]})

        elif path == "/api/queue":
            self._send_json({"success": True, "count": len(DB["queueEntries"]), "delayMinutes": DB["delayMinutes"], "data": DB["queueEntries"]})

        elif path == "/api/revenue":
            self._send_json({
                "success": True,
                "data": {
                    "cashCollected": 540,
                    "checksDeposited": 210,
                    "pendingCnamClaims": 490,
                    "totalGrossRevenue": 1240,
                    "currency": "TND"
                }
            })
        else:
            super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body_bytes = self.rfile.read(content_length) if content_length > 0 else b'{}'
        
        try:
            body = json.loads(body_bytes.decode('utf-8'))
        except:
            body = {}

        path = urllib.parse.urlparse(self.path).path

        if path == "/api/doctors":
            import time
            new_doc = {
                "id": f"doc-{int(time.time())}",
                "name": body.get("name", "Dr. Nouveau Médecin"),
                "title": body.get("title", "Médecin Praticien Agrée"),
                "ordreId": body.get("ordreId", "N° 20194"),
                "specialtyId": body.get("specialtyId", "cardio"),
                "specialtyFr": body.get("specialtyFr", "Médecine Spécialisée"),
                "city": body.get("city", "Tunis"),
                "delegation": body.get("delegation", "Ennasr 2"),
                "address": body.get("address", "Avenue Médicale, Tunis"),
                "phone": body.get("phone", "+216 71 000 000"),
                "fee": body.get("fee", 70),
                "cnamReimbursement": body.get("cnamReimbursement", 49),
                "cnam": True,
                "cnamType": body.get("cnamType", "Conventionné CNAM"),
                "rating": 5.0,
                "reviewsCount": 1,
                "avatar": "../doctor_profile_avatar_1785749404814.png"
            }
            DB["doctors"].insert(0, new_doc)
            self._send_json({"success": True, "message": "Cabinet créé avec succès !", "data": new_doc}, status=201)

        elif path == "/api/appointments":
            import time
            patient_name = body.get("patientName", "Fatma Ben Abdallah")
            new_app = {
                "id": f"app-{int(time.time())}",
                "patientName": patient_name,
                "slotTime": body.get("slotTime", "11:30"),
                "motif": body.get("motif", "Consultation de suivi")
            }
            DB["appointments"].append(new_app)
            new_q = {
                "id": f"q-{int(time.time())}",
                "rank": len(DB["queueEntries"]) + 1,
                "name": patient_name,
                "phone": body.get("patientPhone", "+216 20 999 123"),
                "motif": body.get("motif", "Consultation cabinet"),
                "status": "En salle d'attente",
                "time": body.get("slotTime", "11:30"),
                "payment": "Espèces (70 TND)"
            }
            DB["queueEntries"].append(new_q)
            self._send_json({"success": True, "message": "Rendez-vous réservé avec succès !", "data": new_app}, status=201)

        elif path == "/api/queue/delay":
            minutes = int(body.get("minutes", 15))
            DB["delayMinutes"] += minutes
            self._send_json({"success": True, "message": f"Retard de +{minutes} min signalé aux patients.", "totalDelayMinutes": DB["delayMinutes"]})
        else:
            self._send_json({"error": "Endpoint not found"}, status=404)

if __name__ == "__main__":
    server = HTTPServer(('0.0.0.0', PORT), موعديRequestHandler)
    print(f"[SUCCESS] موعدي Backend REST API Server running at http://localhost:{PORT}")
    server.serve_forever()

