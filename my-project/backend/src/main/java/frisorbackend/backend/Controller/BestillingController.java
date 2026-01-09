package frisorbackend.backend.Controller;
import frisorbackend.backend.Model.Bestilling;
import frisorbackend.backend.Service.BestillingService;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@CrossOrigin(origins = {
    "https://www.bergenfrisor.no", 
    "https://bergenfrisor.no", 
    "https://fris-r-149w.vercel.app", // Legg til denne (din nåværende live-lenke)
    "http://localhost:5173"
})
public class BestillingController{

    @Autowired
    private BestillingService BestillingService;

   @GetMapping("/Bestillinger/mobil/{mobilnummer}")
public ResponseEntity<List<Bestilling>> getBestillingerByMobilnummer(@PathVariable String mobilnummer) {
    List<Bestilling> alleBestillinger = BestillingService.hentBestillingerByMobilnummer(mobilnummer);
    
    LocalDate iDag = LocalDate.now();

// Beholder alle bestillinger som IKKE er før i dag
    List<Bestilling> fremtidigeBestillinger = alleBestillinger.stream()
        .filter(b -> !b.getDato().isBefore(iDag))
        .collect(Collectors.toList());
    
    if (fremtidigeBestillinger.isEmpty()) {
        return ResponseEntity.noContent().build();
    }
    
    return ResponseEntity.ok(fremtidigeBestillinger);
}

    // Denne metode brukes for å vise hvilke tidspunkter er ledige for en spesefikk dato
    @GetMapping("/Bestillinger/{dato}")
    public ResponseEntity<List<Bestilling>> getBestillingerbydato(@PathVariable LocalDate dato) {
        List <Bestilling> bestillinger = BestillingService.hentAlleBestillingerByDato(dato);
        if (bestillinger.isEmpty()){
            return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(bestillinger);
}
    
@PostMapping("/Bestillinger")
public ResponseEntity<?> opprettBestilling(@Valid @RequestBody Bestilling nyBestilling, org.springframework.validation.BindingResult bindingResult) {
    
    // 1. FANG OPP VALIDERINGSFEIL (f.eks. feil datoformat)
    if (bindingResult.hasErrors()) {
        String feilmelding = bindingResult.getFieldError().getDefaultMessage();
        return ResponseEntity.badRequest().body(Map.of("message", feilmelding));
    }

    try {
        // 2. SJEKK OM KUNDEN FAKTISK FINNES (Sikkerhet)
        if (nyBestilling.getKunde() == null || nyBestilling.getKunde().getMobilnummer() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Bestillingen mangler gyldig kunde."));
        }

        Bestilling lagret = BestillingService.lagNyBestilling(nyBestilling);
        return new ResponseEntity<>(lagret, HttpStatus.CREATED);
        
    } catch (Exception e) {
        // 3. HÅNDTER LEDIGE TIDER ELLER DATABASEFEIL
        return ResponseEntity.status(HttpStatus.CONFLICT) // Bruk 409 Conflict for opptatte tider
                             .body(Map.of("message", e.getMessage()));
    }
}


    }
    



    
    
