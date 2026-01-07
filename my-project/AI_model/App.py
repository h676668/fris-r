from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import requests
from Data import Data
from AiModel import AIModel

app = Flask(__name__)
CORS(app)

# --- KONFIGURASJON ---
# Bruker din eksisterende nøkkel og oppsett
HF_TOKEN = "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"
client = OpenAI(base_url="https://router.huggingface.co/v1", api_key=HF_TOKEN)

# Initialisering av dine klasser
ds = Data()
ai = AIModel()
# Bruker din spesifiserte data-split fra [2026-01-03]
data_splits = ds.get_split_data() 
ai.train(data_splits)

# --- INFORMASJON BASERT PÅ DINE BILDER OG KRAV ---
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

def hent_bestillinger_fra_api(mobilnummer):
    """Kobling mot din Java-backend for å finne faktiske reservasjoner."""
    url = f"http://localhost:8080/Bestillinger/mobil/{mobilnummer}"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return response.json(), "suksess"
        elif response.status_code == 204:
            return None, "ingen_data"
        return None, "feil"
    except Exception:
        return None, "connection_error"

def hent_smart_svar(user_input, intent):
    """Genererer svar via AI med strenge instrukser mot gjetting/booking."""
    tjeneste_tekst = "\n".join([f"- {k}: {v}" for k, v in SALONG_INFO['tjenester'].items()])
    
    system_instruks = f"""
    Du er en informasjonsassistent for {SALONG_INFO['navn']}.
    
    STRENGE REGLER:
    1. Du kan ALDRI booke, avbestille eller endre timer. Henvis til telefon eller nettside.
    2. Du vet ALDRI når en kunde har time uten at de har oppgitt et 8-sifret nummer.
    3. Du må ALDRI gjette på datoer eller klokkeslett for reservasjoner. 
    4. Hvis kunden spør om sin time uten nummer, svar: "Jeg trenger mobilnummeret ditt (8 siffer) for å sjekke systemet."

    DIN KUNNSKAP (Tjenester fra bilde):
    {tjeneste_tekst}
    
    ANDRE FAKTA:
    - Adresse: {SALONG_INFO['adresse']}
    - Åpningstider: {SALONG_INFO['aapningstider']}
    """

    try:
        completion = client.chat.completions.create(
            model="Qwen/Qwen2.5-72B-Instruct",
            messages=[
                {"role": "system", "content": system_instruks},
                {"role": "user", "content": user_input}
            ],
            max_tokens=200,
            temperature=0.3 # Lav temperatur for å redusere "kreativ" gjetting
        )
        return completion.choices[0].message.content
    except Exception:
        return "Jeg kan dessverre ikke sjekke dette akkurat nå. Vennligst oppgi mobilnummer for å se dine timer."

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    user_input = data.get("text", "").strip()
    
    if not user_input:
        return jsonify({"reply": "Hei! Hvordan kan jeg hjelpe deg?"})

    # 1. SPERRE FOR BOOKING / AVBESTILLING
    nei_ord = ["booke", "bestille", "reserve", "avbestille", "kansellere", "endre time", "flytte time"]
    if any(ord in user_input.lower() for ord in nei_ord):
        return jsonify({
            "reply": "Jeg kan dessverre ikke booke eller endre timer her i chatten. Vennligst ring oss eller bruk vår online booking. Jeg kan derimot vise deg dine eksisterende timer hvis du skriver inn mobilnummeret ditt!",
            "intent": "begrensning"
        })

    # 2. DATABASE-OPPSLAG (Hvis bruker skriver 8 siffer)
    kun_tall = "".join(filter(str.isdigit, user_input))
    if len(kun_tall) == 8:
        res_data, status = hent_bestillinger_fra_api(kun_tall)
        
        if status == "suksess":
            reply_text = f"Jeg fant følgende reservasjoner på nummer {kun_tall}:\n"
            for b in res_data:
                reply_text += f"📅 Dato: {b['dato']} | ⏰ Tid: {b['tidspunkt']}\n"
            reply_text += "\nVelkommen skal du være!"
            return jsonify({"reply": reply_text})
        elif status == "ingen_data":
            return jsonify({"reply": f"Jeg fant ingen aktive reservasjoner på nummeret {kun_tall}."})
        else:
            return jsonify({"reply": "Systemet mitt for å hente timer er nede akkurat nå, men prøv igjen om litt!"})

    # 3. GENERELT SVAR (Info om priser/tjenester via AI)
    intent, confidence = ai.predict_safe(user_input)
    reply = hent_smart_svar(user_input, intent)

    return jsonify({
        "reply": reply,
        "intent": intent,
        "confidence": float(confidence)
    })

if __name__ == "__main__":
    # Kjører på port 5000 som standard
    app.run(port=5000, debug=True)