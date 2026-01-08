package frisorbackend.backend.Controller;
import frisorbackend.backend.Model.Bestilling;
import frisorbackend.backend.Service.BestillingService;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

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
@CrossOrigin(origins = {"https://www.bergenfrisor.no", "http://localhost:5173"})
public class BestillingController{

    @Autowired
    private BestillingService BestillingService;

    @GetMapping("/Bestillinger/mobil/{mobilnummer}")
    public ResponseEntity<List<Bestilling>> getBestillingerByMobilnummer(@PathVariable String mobilnummer) {
        List<Bestilling> bestillinger = BestillingService.hentBestillingerByMobilnummer(mobilnummer);
        
        if (bestillinger.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        
        return ResponseEntity.ok(bestillinger);
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
public ResponseEntity<?> opprettBestilling(@Valid @RequestBody Bestilling nyBestilling) {
    // Hvis valideringen feiler, vil Spring automatisk returnere 400 Bad Request
    try {
        Bestilling lagret = BestillingService.lagNyBestilling(nyBestilling);
        return new ResponseEntity<>(lagret, HttpStatus.CREATED);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                             .body(Map.of("message", e.getMessage()));
    }
}


    }
    



    
    
