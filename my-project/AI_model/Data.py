import random

class Data:
    def __init__(self):
        # Profesjonelle fyllord for å gjøre modellen robust mot naturlig tale
        self.filler_words = ["liksom", "ehh", "altså", "hm", "ja", "litt", "kanskje", "du", "vel", "faktisk", "sant", "si"]
        
        # Synonymer for å øke den semantiske forståelsen (modellen lærer at disse betyr det samme)
        self.synonymer = {
            "penger": ["kostnad", "beløp", "takst", "prisliste", "sum", "pris"],
            "klipp": ["frisering", "snauing", "stuss", "klipping", "hårklipp", "trimming"],
            "pris": ["kostnad", "beløp", "takst", "prisliste", "sum", "penger"],
            "adresse": ["lokasjon", "sted", "gate", "hvor", "plassering", "veien"],
            "time": ["avtale", "booking", "reservasjon", "bestilling", "oppmøte"],
            "stenger": ["lukker", "avslutter", "ferdig", "stengt"],
            "supert": ["topp", "konge", "genialt", "perfekt", "kjempebra", "bra", "den er god", "nydelig"]
        }

        self.raw_data = {
            'text': [
                # --- PRIS ---
                "Hva koster herreklipp?", "Pris på klipping?", "Hvor mye koster det?", "Prisliste",
                "Hva må jeg betale?", "Er det dyrt hos dere?", "Pris", "Koster", "Hva ligger prisene på?",
                "Hvor mye tar dere?", "Pris på barneklipp?", "Kostnad for farging", "Hva tar dere for vask?",
                "Er det studentrabatt?", "Pris for pensjonist", "Hva koster skjeggklipp?", "Prisoversikt",
                "Hva er prisen for vask og klipp?", "Hva koster det å klippe seg hos dere?", "Priser?",

                # --- TJENESTER ---
                "Hvilke tjenester tilbyr dere?", "Hva slags klipp har dere?", "Vis meg menyen", 
                "Full liste over behandlinger", "Hva kan jeg velge mellom?", "Tjenester", 
                "Behandlinger", "Har dere hårvask?", "Tilbyr dere fade?", "Hva gjør dere?",
                "Vis prislisten", "Jeg vil se alle tjenestene", "Hvilke typer klipp tilbyr dere?",
                "Gjør dere striping?", "Kan jeg få hodebunnsmassasje?", "Styler dere hår til bryllup?",
                "Har dere skjeggpleie?", "Hvilke produkter bruker dere?", "Hva er inkludert i klippen?",
                "Kan man farge håret her?", "Tar dere permanent?", "Tilbyr dere maskinklipp?",

                # --- LOKASJON ---
                "Hvor ligger dere?", "Hva er adressen?", "Hvilken by er dere i?", "Veibeskrivelse",
                "Hvor finner jeg salongen?", "Adresse", "Gateadresse", "Hvor holder dere til?", 
                "Kart", "Finn veien", "Hvor parker man?", "Parkering", "Er det i nærheten av sentrum?",
                "Hvor er inngangen?", "Ligger dere på gateplan?", "Hvordan kommer jeg meg dit?",
                "Er dere i nærheten av busstoppet?", "Hvor i gata er dere?", "Finn butikken",

                # --- ÅPNINGSTIDER ---
                "Når åpner dere?", "Åpningstider i dag?", "Er dere åpne på lørdager?",
                "Når stenger dere?", "Åpnings tider", "Stengetid", "Åpent i helga?", 
                "Når er det åpent?", "Er det åpent nå?", "Langåpent?", "Jobber dere søndager?",
                "Er det åpent i kveld?", "Hvor tidlig starter dere?", "Når tar dere siste kunde?",
                "Hva er åpningstidene deres?", "Når er salongen åpen?", "Stenger dere tidlig?",

                # --- HILSEN ---
                "Hei", "Hallo", "God dag", "Heisann", "Morn morn", "Yo", "Halla",
                "Godmorgen", "Hey", "Heihei", "Hallais", "God kveld", "Hallaen",
                "God dag i stua", "Hei på deg", "Tjenare", "Hyggelig å se deg",
                "Heisann heisann", "God morgen alle sammen", "Er det noen her?",

                # --- PÅMINNELSE ---
                "Husk timen min", "Kan du minne meg på timen?", "Når er timen min?", 
                "Har jeg en time i dag?", "Send meg en påminnelse", "Varsle meg om timen",
                "Glemt når jeg har time", "Påminelse", "Minne meg på", "Når skal jeg klippe meg?",
                "Når har jeg avtale?", "Sjekk bookingen min", "Har jeg time i morgen?",
                "Sjekk når jeg har reservasjon", "Kan du finne avtalen min?", "Når skal jeg møte opp?",

                # --- TAKK ---
                "Takk", "Tusen takk", "Mange takk", "Takk skal du ha", "Takk for hjelpen",
                "Det var snilt", "Flott, takk", "Veldig bra, takk", "Takker", "Den er god, takk",
                "Supert, takk", "Takk for svar", "Kjempefint, takk skal du ha",
                "Supert", "Topp", "Perfekt", "Kjempebra", "Den er grei", "Den er god", "Genialt", "Konge",
                "Helt topp", "Takk for det", "Det var alt, takk", "Takk takk", "Nydelig, takk",

                # --- ANNET ---
                "nei", "jeg vil ikke ha noe", "nei takk", "ingenting", "jeg bare ser", 
                "ha det bra", "snakkes", "hva er 2+2", "hvem er du?", "ha det", "bye bye",
                "ikke i dag", "kanskje senere", "det vet jeg ikke", "hva kan du gjøre?",
                "er du et menneske?", "hvem har laget deg?", "jeg ønsker ikke hjelp",
                "Ok", "Skjønner", "Jeg forstår", "Virkelig?", "Hæ?", "Hvem er her?"
            ],
            'label': [
                "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris",
                "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester", "tjenester",
                "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon",
                "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider",
                "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen",
                "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse",
                "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk", "takk",
                "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet"
            ]
        }
        self.augmented_data = {'text': [], 'label': []}
        self._generate_augmentation()

    def _replace_synonyms(self, text):
        """Bytter ut utvalgte ord med synonymer for å øke variasjon."""
        words = text.split()
        for i, word in enumerate(words):
            clean_word = word.lower().strip("?!.")
            for key, values in self.synonymer.items():
                if clean_word == key:
                    if random.random() < 0.5: # 50% sjanse for å bytte til et synonym
                        words[i] = random.choice(values)
        return " ".join(words)

    def _add_noise(self, text):
        """Legger til fyllord og tegnsetting."""
        words = text.split()
        if random.random() < 0.3:
            words.insert(0, random.choice(self.filler_words))
        
        new_text = " ".join(words)
        if random.random() < 0.2: 
            new_text += random.choice(["?", "!", "..."])
        return new_text

    def _generate_augmentation(self):
        """Hovedfunksjon for datagenerering. Lager ca 7x data."""
        for text, label in zip(self.raw_data['text'], self.raw_data['label']):
            # Legg til originalen
            self.augmented_data['text'].append(text)
            self.augmented_data['label'].append(label)

            for _ in range(6): 
                # 1. Synonym-bytte
                variant = self._replace_synonyms(text)
                
                # 2. Skrivefeil (bytte bokstaver)
                chars = list(variant.lower())
                if len(chars) > 5:
                    idx = random.randint(0, len(chars) - 2)
                    chars[idx], chars[idx+1] = chars[idx+1], chars[idx]
                variant = "".join(chars)

                # 3. Fyllord og støy
                variant = self._add_noise(variant)
                
                # 4. Tilfeldig fjerning av mellomrom
                if random.random() < 0.3:
                    variant = variant.replace(" ", "")

                self.augmented_data['text'].append(variant)
                self.augmented_data['label'].append(label)

    def get_split_data(self, train_size=0.7, val_size=0.15):
        """Deler dataene i trening, validering og test [2026-01-03]."""
        combined = list(zip(self.augmented_data['text'], self.augmented_data['label']))
        random.shuffle(combined)
        
        n = len(combined)
        train_end = int(n * train_size)
        val_end = int(n * (train_size + val_size))
        
        return {
            'train': {
                'text': [x[0] for x in combined[:train_end]], 
                'label': [x[1] for x in combined[:train_end]]
            },
            'val': {
                'text': [x[0] for x in combined[train_end:val_end]], 
                'label': [x[1] for x in combined[train_end:val_end]]
            },
            'test': {
                'text': [x[0] for x in combined[val_end:]], 
                'label': [x[1] for x in combined[val_end:]]
            }
        }