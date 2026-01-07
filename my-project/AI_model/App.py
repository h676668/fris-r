from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import requests
import os
from dotenv import load_dotenv

# Importerer dine egne filer
from Data import Data
from AiModel import AIModel

# --- KONFIGURASJON OG SIKKERHET ---
load_dotenv()  # Laster variabler fra .env-filen

app = Flask(__name__)
CORS(app)

# Henter token fra .env
HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    print("❌ FEIL: Fant ikke HF_TOKEN i .env-filen!")
else:
    print(f"✅ Token lastet inn (starter med: {HF_TOKEN[:5]}...)")

# Oppsett av OpenAI-klient mot Hugging Face Router
client = OpenAI(base_url="https://router.huggingface.co/v1", api_key=HF_TOKEN)

# --- INITIALISERING AV MODELL ---
ds = Data()
ai = AIModel()

print("🔄 Laster og splitter data (Training, Validation, Test)...")
# Her brukes din logikk for splitting av data i validation og test [2026-01-03]
data_splits = ds.get_split_data()

print("🧠 Trener lokal AI-modell...")
ai.train(data_splits)
print("🚀 Serveren er klar!")

# --- SALONGDATA ---
SALONG_INFO = {
    "navn": "Bergen Frisør-Bot",
    "adresse": "Lille Lungegårdsvannet 1",
    "aapningstider": "09:00 - 20:00 hver dag",
    "tjenester": {
        "Klassisk Klipp": "fra 349,- (Skreddersydd klipp som passer din ansiktsform og stil)",
        "Hårvask & Kur": "fra 199,- (Dyperens og pleie for hodebunn og hår med premium produkter)",
        "Barbering & Fade": "fra 399,- (Presisjonsarbeid med kniv og maskin for den perfekte looken)",
        "Skjeggtrim": "fra 249,- (Forming og pleie av skjegg for en velstelt fremtoning)"
    }
}

# --- HJELPEFUNKSJONER ---

def hent_bestillinger_fra_api(mobilnummer):
    """Kobler seg mot Java-backend for å hente reservasjoner."""
    url = f"http://localhost:8080/Bestillinger/mobil/{mobilnummer}"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return response.json(), "suksess"
        return None, "ingen_data"
    except Exception as e:
        print(f"API-feil: {e}")
        return None, "feil"

def hent_smart_svar(user_input, intent):
    """Genererer naturlig svar via Hugging Face Qwen-modell."""
    tjeneste_tekst = "\n".join([f"- {k}: {v}" for k, v in SALONG_INFO['tjenester'].items()])
    
    system_instruks = f"""
    Du er en assistent for {SALONG_INFO['navn']}.
    
    INFO OM SALONGEN:
    {tjeneste_tekst}
    Adresse: {SALONG_INFO['adresse']}
    Åpningstider: {SALONG_INFO['aapningstider']}

    REGLER:
    1. Du kan IKKE booke, endre eller avbestille timer. Be kunden ringe oss.
    2. Svar kort, profesjonelt og vennlig på norsk.
    3. Hvis kunden spør om egne timer, be dem oppgi sitt 8-sifrede mobilnummer.
    """
    
    try:
        completion = client.chat.completions.create(
            model="Qwen/Qwen2.5-72B-Instruct",
            messages=[
                {"role": "system", "content": system_instruks},
                {"role": "user", "content": user_input}
            ],
            max_tokens=250,
            temperature=0.3
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"AI-feil: {e}")
        # HER ER FEILEN RETTET (bruker enkle hermetegn inni de doble):
        return "Jeg har litt problemer med å kontakte 'hovedhjernen' min, men vi tilbyr klipp fra 349,-. Hva kan jeg hjelpe med?"

# --- API ENDEPUNKTER ---

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    user_input = data.get("text", "").strip()
    
    if not user_input:
        return jsonify({"reply": "Hei! Hva kan jeg hjelpe deg med i dag?"})

    # 1. Sperre for booking-handlinger
    nei_ord = ["booke", "bestille", "reserve", "avbestille", "kansellere", "endre"]
    if any(ord in user_input.lower() for ord in nei_ord):
        return jsonify({
            "reply": "Jeg kan dessverre ikke endre eller booke timer her. Vennligst ring oss, så hjelper vi deg gjerne over telefon!"
        })

    # 2. Sjekk for mobilnummer (8 siffer)
    kun_tall = "".join(filter(str.isdigit, user_input))
    if len(kun_tall) == 8:
        res_data, status = hent_bestillinger_fra_api(kun_tall)
        if status == "suksess":
            linjer = [f"📅 {b['dato']} kl. {b['tidspunkt']}" for b in res_data]
            reply = f"Jeg fant følgende reservasjoner på {kun_tall}:\n" + "\n".join(linjer)
            return jsonify({"reply": reply})
        elif status == "ingen_data":
            return jsonify({"reply": f"Fant ingen aktive reservasjoner på nummer {kun_tall}."})
        else:
            return jsonify({"reply": "Beklager, jeg får ikke kontakt med bookingsystemet akkurat nå."})

    # 3. Generelt svar via lokal intent-modell og ekstern AI
    intent, confidence = ai.predict_safe(user_input)
    reply = hent_smart_svar(user_input, intent)

    return jsonify({
        "reply": reply, 
        "intent": intent,
        "confidence": float(confidence)
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)