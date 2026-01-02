package frisorbackend.backend.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import frisorbackend.backend.Model.Bestilling;
import frisorbackend.backend.Repository.BestillingRepository; 


@Service
public class BestillingService {

    
    private final BestillingRepository bestillingRepository;

    @Autowired
    public BestillingService(BestillingRepository bestillingRepository){
        this.bestillingRepository = bestillingRepository;
    }
    public List<Bestilling> hentAlleBestillingerByDato(java.time.LocalDate dato){
        return bestillingRepository.findByDato(dato);
        
    }
    
}