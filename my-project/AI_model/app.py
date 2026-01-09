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
load_dotenv()  # Laster variabler fra .env-filen (lokalt)

app = Flask(__name__)

# OPPDATERT: Tillater kun forespørsler fra ditt domene for bedre sikkerhet
CORS(app, resources={r"/*": {"origins": ["https://www.bergenfrisor.no", "https://bergenfrisor.no"]}})

# Henter token fra miljøvariabler (viktig for Render)
HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    print("❌ FEIL: Fant ikke HF_TOKEN! Husk å legge den inn i Render Environment Variables.")
else:
    print(f"✅ Token lastet inn (starter med: {HF_TOKEN[:5]}...)")

client = OpenAI(base_url="https://router.huggingface.co/v1", api_key=HF_TOKEN)

# Initialiserer data og modell
ds = Data()
ai = AIModel()

# SIKRER DINE KRAV: Dataene blir delt i train, validation og test ved oppstart
print("🔄 Laster og splitter data (Training, Validation, Test)...")
data_splits = ds.get_split_data()

print("🧠 Trener lokal AI-modell...")
ai.train(data_splits)
print("🚀 Serveren er klar!")

SALONG_INFO = {
    "navn": "Bergen Frisør",
    "adresse": "Lille Lungegårdsvannet 1",
    "aapningstider": "09:00 - 20:00 hver dag",
    "tjenester": {
        "Klassisk Klipp": "fra 349,- (Skreddersydd klipp som passer din ansiktsform og stil)",
        "Hårvask & Kur": "fra 199,- (Dyperens og pleie for hodebunn og hår med premium produkter)",
        "Barbering & Fade": "fra 399,- (Presisjonsarbeid med kniv og maskin for den perfekte looken)",
        "Skjeggtrim": "fra 249,- (Forming og pleie av skjegg for en velstelt fremtoning)"
    }
}

def hent_bestillinger_fra_api(mobilnummer):
    """Kobler seg mot Java-backend for å hente reservasjoner."""
    url = f"https://frisor-backend.onrender.com/Bestillinger/mobil/{mobilnummer}"
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
        return "Beklager, tjenesten er midlertidig utilgjengelig. Vennligst prøv igjen om en liten stund"

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    user_input = data.get("text", "").strip()
    
    if not user_input:
        return jsonify({"reply": "Hei! Hva kan jeg hjelpe deg med i dag?"})

    # Sperre for booking-forespørsler
    nei_ord = ["booke", "bestille", "reserve", "avbestille", "kansellere", "endre"]
    if any(ord in user_input.lower() for ord in nei_ord):
        return jsonify({
            "reply": "Jeg kan dessverre ikke endre eller booke timer her. Vennligst ring oss, så hjelper vi deg gjerne over telefon!"
        })

    # Sjekk for mobilnummer (8 siffer) for å hente timer
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

    # Bruker AI-modellen for andre spørsmål
    intent, confidence = ai.predict_safe(user_input)
    reply = hent_smart_svar(user_input, intent)

    return jsonify({
        "reply": reply, 
        "intent": intent,
        "confidence": float(confidence)
    })

# OPPDATERT: Sørger for at Render kan styre port og host
if __name__ == "__main__":
    # Render setter PORT miljøvariabelen automatisk
    port = int(os.environ.get("PORT", 5000))
    # host="0.0.0.0" er nødvendig for at tjenesten skal være synlig utad
    app.run(host="0.0.0.0", port=port, debug=False)