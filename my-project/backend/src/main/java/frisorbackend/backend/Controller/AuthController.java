package frisorbackend.backend.Controller;

import frisorbackend.backend.Service.EmailService;
import frisorbackend.backend.Repository.KundeRepository; // Importer repository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private KundeRepository kundeRepository; // Koble til databasen

    private Map<String, String> kodeLager = new HashMap<>();

    public String genererSikkerKode() {
        SecureRandom random = new SecureRandom();
        int nummer = 100000 + random.nextInt(900000);
        return String.valueOf(nummer);
    }

    @PostMapping("/send-kode")
    public ResponseEntity<?> sendVerifisering(@RequestBody Map<String, String> request) {
        String epost = request.get("epost").trim().toLowerCase();
        
        // 1. Sjekk om e-posten allerede finnes i databasen
        if (kundeRepository.existsByEpost(epost)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Denne e-postadressen er allerede i bruk."));
        }

        // 2. Generer og send kode hvis e-posten er ledig
        String kode = genererSikkerKode();
        kodeLager.put(epost, kode);
        emailService.sendVerifiseringsKode(epost, kode);
        
        System.out.println("DEBUG: Kode sendt til " + epost + " er " + kode);
        return ResponseEntity.ok(Map.of("message", "Kode sendt!"));
    }

    @PostMapping("/verifiser-kode")
    public ResponseEntity<?> verifiserKode(@RequestBody Map<String, String> request) {
        String epost = request.get("epost").trim().toLowerCase();
        String kodeFraBruker = request.get("kode").trim();

        String riktigKode = kodeLager.get(epost);

        if (riktigKode != null && riktigKode.equals(kodeFraBruker)) {
            kodeLager.remove(epost); // Slett koden etter bruk
            return ResponseEntity.ok(Map.of("status", "success", "message", "Koden er gyldig!"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("status", "error", "message", "Feil eller utløpt kode."));
        }
    }
}