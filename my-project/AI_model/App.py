from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import requests
from Data import Data
try:
    from AiModel import AIModel
except ImportError:
    from AIModel import AIModel

app = Flask(__name__)
CORS(app)  # Tillater kommunikasjon mellom React og Python

# --- INITIALISERING (Nøyaktig som din main) ---
ds = Data()
ai = AIModel()

print("\033[92m[SYSTEM] Initialiserer AI og validerer datasett (Train/Val/Test)...\033[0m")
data_splits = ds.get_split_data()
ai.train(data_splits)

# Variabel for å holde på kontekst (last_intent) mellom API-kall
state = {"last_intent": None}

# --- DINE ORIGINALE RESPONSES (INGENTING FJERNET) ---
responses = {
    "pris": [
        "Prisene våre starter på 349,- for klassisk herreklipp. Si ifra hvis du vil se hele listen.",
        "En standard klipp ligger på 349,- hos oss.",
        "Vi har priser fra 349 kr for klipp og 249 kr for skjeggtrim."
    ],
    "tjenester": [
        "\n--- TJENESTEMENY ---\n01. Klassisk Klipp ....... fra 349,-\n02. Hårvask & Kur ........ fra 199,-\n03. Barbering & Fade ..... fra 399,-\n04. Skjeggtrim ........... fra 249,-\n",
        "\nHer er våre behandlinger:\n✂️ Klassisk Klipp: 349,-\n🧼 Hårvask & Kur: 199,-\n🪒 Barbering & Fade: 399,-\n🧔 Skjeggtrim: 249,-\n"
    ],
    "lokasjon": [
        "Vi holder til i Storgata 15.",
        "Adressen vår er Storgata 15. Velkommen!",
        "Du finner oss i Storgata 15, midt i sentrum."
    ],
    "aapningstider": [
        "Vi er åpent hver dag fra 09:00 til 20:00.",
        "Våre åpningstider er 09:00 - 20:00 alle dager.",
        "Vi holder åpent til kl. 20:00 på hverdager."
    ],
    "hilsen": [
        "Hei! Hvordan kan jeg hjelpe deg i dag? 😊",
        "Heisann! Hva lurer du på?",
        "God dag. Hva kan jeg bistå med?"
    ],
    "paaminnelse": [
        "Selvfølgelig! Vennligst oppgi ditt 8-sifrede mobilnummer, så sjekker jeg systemet med en gang.",
        "Det kan jeg sjekke for deg. Hvilket mobilnummer er bestillingen registrert på?",
        "For å finne dine reservasjoner trenger jeg mobilnummeret ditt (8 siffer).",
        "Ikke noe problem! Skriv inn mobilnummeret ditt her, så henter jeg opp avtalene dine.",
        "Jeg hjelper deg gjerne med det. Kan jeg få mobilnummeret ditt for å slå opp i kalenderen?"
    ],
    "takk": [
        "Bare hyggelig! Si ifra hvis du trenger noe mer. 😊",
        "Ingen årsak, hyggelig å hjelpe!",
        "Det var bare hyggelig! Ha en fin dag videre.",
        "Bare hyggelig!"
    ],
    "annet": [
        "Den er god.",
        "Skjønner. Jeg er her hvis du trenger mer hjelp senere.",
        "Den er grei."
    ],
    "usikker": [
        "Beklager, jeg forsto ikke helt. Kan du prøve å skrive det på en annen måte? 🤔",
        "Jeg er litt usikker på hva du mener. Gjelder det pris, tid eller sted?"
    ]
}

def hent_bestillinger_fra_api(mobilnummer):
    """Robust API-oppslag med håndtering av timeout og nettverksfeil."""
    url = f"http://localhost:8080/Bestillinger/mobil/{mobilnummer}"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return response.json(), "suksess"
        elif response.status_code == 204:
            return None, "ingen_data"
        else:
            return None, "feil"
    except (requests.exceptions.ReadTimeout, requests.exceptions.ConnectError):
        return None, "timeout_error"
    except Exception:
        return None, "ukjent_feil"

# --- API ENDEPUNKT FOR REACT ---
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    user_input = data.get("text", "").strip()
    
    if not user_input:
        return jsonify({"reply": ""})

    # --- SMART MOBIL-VALIDERING (Nøyaktig lik din main) ---
    kun_tall = "".join(filter(str.isdigit, user_input))
    
    if 4 <= len(kun_tall) <= 12:
        if len(kun_tall) == 8:
            print(f"\033[93m[SYSTEM] Sjekker database for {kun_tall}...\033[0m")
            res_data, status = hent_bestillinger_fra_api(kun_tall)
            
            if status == "suksess":
                reply_text = "Jeg fant dine reservasjoner:\n"
                for b in res_data:
                    reply_text += f"📅 Dato: {b['dato']} | ⏰ Tid: {b['tidspunkt']}\n"
                return jsonify({"reply": reply_text})
            elif status == "ingen_data":
                return jsonify({"reply": f"Jeg fant ingen aktive bestillinger på nummeret {kun_tall}."})
            elif status == "timeout_error":
                return jsonify({"reply": "Systemet bruker for lang tid på å svare. Prøv igjen om et øyeblikk."})
            else:
                return jsonify({"reply": "Kunne ikke koble til serveren. Sjekk at Java-backenden kjører."})
        else:
            return jsonify({"reply": f"Nummeret '{user_input}' har feil lengde. Vennligst bruk 8 siffer."})

    # --- AI-KLASSIFISERING (Nøyaktig lik din main) ---
    intent, confidence = ai.predict_safe(user_input)

    # Threshold-sjekk
    if confidence < 0.30:
        intent = "usikker"

    # Kontekst-logikk (Nøyaktig lik din main)
    if state["last_intent"] == "pris" and any(x in user_input.lower() for x in ["ja", "vis", "liste", "gjerne", "ok"]):
        intent = "tjenester"

    print(f"\033[94m[DEBUG] Intent: {intent} ({confidence*100:.1f}%)\033[0m")
    
    # Lagre nåværende intent for neste gang (kontekst)
    state["last_intent"] = intent
    
    # Velg svar fra de samme listene som i main
    current_responses = responses.get(intent, responses["usikker"])
    final_reply = random.choice(current_responses)
    
    return jsonify({
        "reply": final_reply,
        "intent": intent,
        "confidence": float(confidence)
    })

if __name__ == "__main__":
    print("\n" + "="*50)
    print("--- FRISØR-BOT API ER KLAR ---")
    print("="*50 + "\n")
    app.run(port=5000, debug=True)