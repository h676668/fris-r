package frisorbackend.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import frisorbackend.backend.Exception.KundeIkkeFunnetException;
import frisorbackend.backend.Model.Kunde;
import frisorbackend.backend.Service.KundeService;
import jakarta.validation.Valid; // Viktig import

import java.util.Map;

@RestController
@CrossOrigin(origins = {
    "https://www.bergenfrisor.no", 
    "https://bergenfrisor.no", 
    "https://fris-r-149w.vercel.app", // Legg til denne (din nåværende live-lenke)
    "http://localhost:5173"
})
public class KundeController {

    @Autowired
    private KundeService kundeService;

    @GetMapping("kunder/{Mobilnummer}")
    public ResponseEntity<Kunde> hentkunde(@PathVariable String Mobilnummer) throws KundeIkkeFunnetException {
        Kunde kunde = kundeService.hentKundeEttermobil(Mobilnummer);
        if (kunde == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(kunde);
    }

    @PostMapping("/kunder")
    public ResponseEntity<?> leggKunde(@Valid @RequestBody Kunde kunde) {
        try {
            
            Kunde nykunde = kundeService.leggNyKunde(
                kunde.getMobilnummer(), 
                kunde.getNavn(), 
                kunde.getEpost()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(nykunde);
        } catch (Exception e) {
           
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Mobilnummer eller e-post er allerede registrert."));
        }
    }
}