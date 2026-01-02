package frisorbackend.backend.Controller;
import frisorbackend.backend.Model.Bestilling;
import frisorbackend.backend.Service.BestillingService;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class BestillingController{

    @Autowired
    private BestillingService BestillingService;



    @GetMapping("/Bestillinger/{dato}")
    public ResponseEntity<List<Bestilling>> getBestillingerbydato(@PathVariable LocalDate dato) {
        List <Bestilling> bestillinger = BestillingService.hentAlleBestillingerByDato(dato);
        if (bestillinger.isEmpty()){
            return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok(bestillinger);
}
    
    
}