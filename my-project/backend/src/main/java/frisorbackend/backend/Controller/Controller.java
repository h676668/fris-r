package frisorbackend.backend.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import frisorbackend.backend.Exception.KundeIkkeFunnetException;
import frisorbackend.backend.Model.Kunde;
import frisorbackend.backend.Service.KundeService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class Controller {

       @Autowired
    private KundeService KundeService;


    @GetMapping("kunder/{Mobilnummer}")
    public ResponseEntity <Kunde> test(@PathVariable String Mobilnummer ) throws KundeIkkeFunnetException {
        Kunde kunde = KundeService.hentKundeEttermobil(Mobilnummer);
        if (kunde == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(kunde);
    }

}
