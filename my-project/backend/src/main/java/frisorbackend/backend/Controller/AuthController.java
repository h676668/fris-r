package frisorbackend.backend.Controller;

import frisorbackend.backend.Service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") // Stemmer for Vite/React!
public class AuthController {

    @Autowired
    private EmailService emailService;

    // Lageret som husker kodene
    private Map<String, String> kodeLager = new HashMap<>();

    public String genererSikkerKode() {
        SecureRandom random = new SecureRandom();
        int nummer = 100000 + random.nextInt(900000);
        return String.valueOf(nummer);
    }


    @PostMapping("/send-kode")
    public ResponseEntity<?> sendVerifisering(@RequestBody Map<String, String> request) {
        String epost = request.get("epost");
        String kode = genererSikkerKode();
        
        kodeLager.put(epost, kode); // lagrer koden knyttet til e-posten
        emailService.sendVerifiseringsKode(epost, kode);
        
        return ResponseEntity.ok(Map.of("message", "Kode sendt!"));
    }

    
    @PostMapping("/verifiser-kode")
    public ResponseEntity<?> verifiserKode(@RequestBody Map<String, String> request) {
        String epost = request.get("epost");
        String kodeFraBruker = request.get("kode");

        // Hent koden vi faktisk sendte til denne e-posten
        String riktigKode = kodeLager.get(epost);

        if (riktigKode != null && riktigKode.equals(kodeFraBruker)) {
            // Suksess! Vi sletter koden fra lageret så den ikke kan brukes to ganger
            kodeLager.remove(epost);
            return ResponseEntity.ok(Map.of("status", "success", "message", "Koden er gyldig!"));
        } else {
            // Feil kode
            return ResponseEntity.status(401).body(Map.of("status", "error", "message", "Feil kode, prøv igjen."));
        }
    }
}