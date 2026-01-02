package frisorbackend.backend.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import frisorbackend.backend.Exception.KundeIkkeFunnetException;
import frisorbackend.backend.Model.Kunde;
import frisorbackend.backend.Service.KundeService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class KundeController {

       @Autowired
    private KundeService KundeService;


    @GetMapping("kunder/{Mobilnummer}")
    public ResponseEntity <Kunde> hentkunde(@PathVariable String Mobilnummer ) throws KundeIkkeFunnetException {
        Kunde kunde = KundeService.hentKundeEttermobil(Mobilnummer);
        if (kunde == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(kunde);
    }
    @PostMapping("/kunder")
    public ResponseEntity<Kunde> leggKunde(@RequestBody Kunde kunde) {
        Kunde nykunde = KundeService.leggNyKunde(kunde.getMobilnummer(), kunde.getNavn(), kunde.getEpost());
        return ResponseEntity.status(HttpStatus.CREATED).body(nykunde);
    }

    
        
    
    

}
