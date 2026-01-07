import random

class Data:
    def __init__(self):
        self.filler_words = ["liksom", "ehh", "faktisk", "altså"]
        self.synonymer = {
            "klipp": ["hårklipp", "stuss", "trim", "frisering"],
            "pris": ["kostnad", "prisliste", "sum", "beløp"],
            "adresse": ["sted", "lokasjon", "gate", "veien"]
        }

        self.raw_data = {
            'text': [
                # PRIS (Tydelige forespørsler)
                "Hva koster det?", "Prisliste", "Hva er prisen på fade?", "Hvor mye tar dere for klipp?",
                "Hva må jeg betale?", "Kostnad for barbering",
                # TJENESTER
                "Hvilke tjenester har dere?", "Har dere fade?", "Hva gjør dere?", "Behandlinger",
                # LOKASJON
                "Hvor er dere?", "Adresse", "Ligger dere i Bergen?", "Hvor er salongen?",
                # PÅMINNELSE / BOOKING
                "Når er timen min?", "Glemt booking", "Sjekk min avtale", "Har jeg time?",
                "Husk timen min", "Hvilken tid har jeg bestilt?"
            ],
            'label': [
                "pris", "pris", "pris", "pris", "pris", "pris",
                "tjenester", "tjenester", "tjenester", "tjenester",
                "lokasjon", "lokasjon", "lokasjon", "lokasjon",
                "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse", "paaminnelse"
            ]
        }
        self.augmented_data = {'text': [], 'label': []}
        self._generate_augmentation()

    def _generate_augmentation(self):
        for text, label in zip(self.raw_data['text'], self.raw_data['label']):
            for _ in range(40): 
                variant = text
                if random.random() < 0.6:
                    words = variant.split()
                    for i, w in enumerate(words):
                        cw = w.lower().strip("?!.")
                        if cw in self.synonymer:
                            words[i] = random.choice(self.synonymer[cw])
                    variant = " ".join(words)
                self.augmented_data['text'].append(variant.lower())
                self.augmented_data['label'].append(label)

    def get_split_data(self):
        combined = list(zip(self.augmented_data['text'], self.augmented_data['label']))
        random.shuffle(combined)
        n = len(combined)
        return {
            'train': {'text': [x[0] for x in combined[:int(n*0.7)]], 'label': [x[1] for x in combined[:int(n*0.7)]]},
            'val': {'text': [x[0] for x in combined[int(n*0.7):int(n*0.85)]], 'label': [x[1] for x in combined[int(n*0.7):int(n*0.85)]]},
            'test': {'text': [x[0] for x in combined[int(n*0.85):]], 'label': [x[1] for x in combined[int(n*0.85):]]}
        }