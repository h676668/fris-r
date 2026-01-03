import random
import requests
from Data import Data
# Her antar vi at filen din heter AiModel.py, men klassen heter AIModel
try:
    from AiModel import AIModel
except ImportError:
    from AIModel import AIModel

def hent_bestillinger_fra_api(mobilnummer):
    """Hjelpefunksjon for å snakke med Spring Boot backend"""
    # Denne URL-en matcher din @GetMapping("/Bestillinger/mobil/{mobilnummer}")
    url = f"http://localhost:8080/Bestillinger/mobil/{mobilnummer}"
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return response.json(), "suksess"
        elif response.status_code == 204:
            return None, "ingen_data"
        else:
            return None, "feil"
    except requests.exceptions.ConnectionError:
        return None, "connection_error"

def main():
    # 1. Initialiserer data og AI
    ds = Data()
    ai = AIModel() # Bruker store bokstaver for klassen
    
    # 2. Trener modellen med splittet data (Train, Val, Test)
    print("\033[92m[SYSTEM] Trener AI-modellen og validerer data...\033[0m")
    data_splits = ds.get_split_data()
    ai.train(data_splits)

    # 3. Svar-ordbok for samtale
    responses = {
        "pris": [
            "Herreklipp starter på 500 kr. Høres det greit ut, eller vil du se hele prislisten?",
            "Vi ligger på ca. 500-700 kr for klipp. Er det noe spesielt du har sett for deg?"
        ],
        "lokasjon": [
            "Vi holder til i Storgata 15. Vet du hvor det er, eller trenger du en veibeskrivelse?",
            "Du finner oss rett ved torget i Storgata 15. Kommer du med bil eller buss?"
        ],
        "aapningstider": [
            "Vi har åpent fra 09 til 17 hver dag. Passer det best på formiddagen eller etter jobb?",
            "Hverdager 09-17 og lørdager 09-15. Skal jeg sjekke om vi har åpent i morgen?"
        ],
        "hilsen": [
            "Heisann! Så hyggelig at du tar kontakt. Hvordan kan jeg hjelpe deg i dag? 😊",
            "Hei! Velkommen til oss. Har du noen spørsmål om klipp eller priser?"
        ],
        "paaminnelse": [
            "Selvfølgelig! Jeg kan sjekke det for deg i databasen. Hva er mobilnummeret ditt?",
            "Det fikser vi. Hvis du gir meg mobilnummeret ditt (8 siffer), skal jeg finne timen din."
        ],
        "annet": [
            "Den er grei! Er det noe annet frisør-relatert jeg kan hjelpe deg med?",
            "Skjønner. Bare si ifra hvis du trenger hjelp med noe annet senere!"
        ],
        "usikker": [
            "Beklager, den skjønte jeg ikke helt. Lurte du på pris eller lokasjon? 🤔",
            "Hmm, jeg er litt usikker. Kan du forklare det med litt andre ord?"
        ]
    }

    print("\n" + "="*50)
    print("--- FRISØR-BOT ER KLAR (Backend-integrert) ---")
    print("Skriv 'exit' for å avslutte.")
    print("="*50 + "\n")

    while True:
        user_input = input("Deg: ").strip()
        if user_input.lower() == 'exit':
            print("AI: Ha en fin dag videre!")
            break

        # --- LOGIKK: Er input et mobilnummer? ---
        if user_input.isdigit() and len(user_input) == 8:
            print(f"\033[93m[SYSTEM] Kobler til database for nummer: {user_input}...\033[0m")
            data, status = hent_bestillinger_fra_api(user_input)
            
            if status == "suksess":
                print(f"AI: Jeg fant din bestilling! Her er detaljene:")
                for b in data:
                    # Henter dato og tid fra din Bestilling-modell. 
                    # Husk at 'b' er et JSON-objekt fra Java-serveren din.
                    print(f"  📅 Dato: {b['dato']} | ⏰ Tid: {b['tidspunkt']}")
                print("AI: Er det noe annet jeg kan hjelpe deg med?")
            elif status == "ingen_data":
                print(f"AI: Jeg fant dessverre ingen aktive timer på nummeret {user_input}.")
            elif status == "connection_error":
                print("AI: Beklager, jeg klarer ikke å koble til databasen. Er Java-serveren startet?")
            else:
                print("AI: Det skjedde en teknisk feil ved henting av data.")
            
            print("-" * 30)
            continue

        # --- AI-LOGIKK: Klassifisering av tekst ---
        intent, confidence = ai.predict_safe(user_input)
        
        # Omdiriger 'bestilling' til 'annet'
        if intent == "bestilling":
            intent = "annet"

        print(f"\033[94m[DEBUG] Intent: {intent} | Sikkerhet: {confidence*100:.1f}%\033[0m")

        current_responses = responses.get(intent, responses["usikker"])
        print(f"AI: {random.choice(current_responses)}")
        print("-" * 30)

if __name__ == "__main__":
    main()