import random

class Data:
    def __init__(self):
        self.raw_data = {
            'text': [
                # --- PRIS ---
                "Hva koster herreklipp?", "Pris på klipping?", "Hvor mye koster det?", "Prisliste",
                "Hva må jeg betale?", "Hvor mye tar dere for skjeggtrim?", "Er det dyrt hos dere?",
                "Hva ligger prisene på?", "Pris", "Koster", "Hva koster herre klipp", 
                "Prisene", "Koster det mye?", "Hva koster dame klipp?", "Skjegg pris", 
                "Hva er prisen på farging?", "Studentrabatt pris", "Hva koster det å klippe seg?",

                # --- LOKASJON ---
                "Hvor ligger dere?", "Hva er adressen?", "Hvilken by er dere i?", "Veibeskrivelse",
                "Hvor finner jeg salongen?", "Hvor er dere?", "Adresse", "Gateadresse", 
                "Hvor holder dere til?", "Kart", "Vei beskrivelse", "Kor ligge dåkker?", 
                "Finn veien", "Hvor parker man?", "Parkering", "Ligger dere i sentrum?",

                # --- ÅPNINGSTIDER ---
                "Når åpner dere?", "Åpningstider i dag?", "Er dere åpne på lørdager?",
                "Når stenger dere?", "Når er det kveldsåpent?", "Jobber dere på søndager?",
                "Åpnings tider", "Åpningstider", "Stengetid", "Åpent i helga?", 
                "Når er det åpent?", "Når åpner dokker?", "Er det åpent nå?", "Langåpent?",

                # --- HILSEN ---
                "Hei", "Hallo", "God dag", "Heisann", "Morn morn", "Yo", "Halla",
                "Godmorgen", "Heei", "Hallaen", "Hey", "Heihei", "Tjenare",
                "Morn", "Hallais", "God kveld", "Hyggelig å se deg", "Hei på deg",

                # --- PÅMINNELSE (NY!) ---
                "Husk timen min", "Kan du minne meg på timen?", "Når er timen min?", 
                "Har jeg en time i dag?", "Send meg en påminnelse", "Varsle meg om timen",
                "Glemt når jeg har time", "Påminelse", "Minne meg på", "Når skal jeg klippe meg?",
                "Kan du gi meg beskjed når timen nærmer seg?", "Hvilken tid har jeg?",

                # --- ANNET / IKKE RELEVANT ---
                "nei", "jeg vil ikke ha noe", "nei takk", "ingenting", "jeg bare ser", 
                "ha det bra", "snakkes", "hva er 2+2", "hvem er du?", "jeg ønsker ikke noe",
                "jeg vil bestille time", "booke klipp", "trenger en time", "bestilling",
                "ikke nå", "kanskje senere", "ha det", "bye bye", "hvem er din far?"
            ],
            'label': [
                "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris", "pris", 
                "pris", "pris", "pris", "pris", "pris", "pris", "pris",
                "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", 
                "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon", "lokasjon",
                "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", 
                "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider", "aapningstider",
                "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", 
                "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen", "hilsen",
                "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", 
                "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse",
                "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", 
                "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet", "annet"
            ]
        }
        self.augmented_data = {'text': [], 'label': []}
        self._generate_augmentation()

    def _generate_augmentation(self):
        for text, label in zip(self.raw_data['text'], self.raw_data['label']):
            self.augmented_data['text'].append(text)
            self.augmented_data['label'].append(label)
            # Lager 2 varianter med skrivefeil for hvert eksempel
            for _ in range(2):
                variant = list(text.lower())
                if len(variant) > 4:
                    idx = random.randint(0, len(variant) - 2)
                    variant[idx], variant[idx+1] = variant[idx+1], variant[idx]
                new_text = "".join(variant)
                if random.random() > 0.5:
                    new_text = new_text.replace(" ", "")
                self.augmented_data['text'].append(new_text)
                self.augmented_data['label'].append(label)

    def get_split_data(self, train_size=0.7, val_size=0.15):
        combined = list(zip(self.augmented_data['text'], self.augmented_data['label']))
        random.shuffle(combined)
        n = len(combined)
        train_end = int(n * train_size)
        val_end = int(n * (train_size + val_size))
        
        # Datene deles her i trening, validering og test som avtalt
        return {
            'train': {'text': [x[0] for x in combined[:train_end]], 'label': [x[1] for x in combined[:train_end]]},
            'val': {'text': [x[0] for x in combined[train_end:val_end]], 'label': [x[1] for x in combined[train_end:val_end]]},
            'test': {'text': [x[0] for x in combined[val_end:]], 'label': [x[1] for x in combined[val_end:]]}
        }