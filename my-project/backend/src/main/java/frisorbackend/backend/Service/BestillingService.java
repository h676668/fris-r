package frisorbackend.backend.Service;

import java.time.LocalDate;
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

    public Bestilling lagNyBestilling(Bestilling nyBestilling) throws Exception {
        LocalDate valgtDato = nyBestilling.getDato();
        String mobil = nyBestilling.getKunde().getMobilnummer();

        LocalDate startDato = valgtDato.minusDays(7);
        LocalDate sluttDato = valgtDato.plusDays(7);

        List<Bestilling> eksisterende = bestillingRepository.findByKundeMobilnummerAndDatoBetween(mobil, startDato, sluttDato);

        if (!eksisterende.isEmpty()) {
            throw new Exception("Du kan bare bestille time én gang i uken.");
        }

        return bestillingRepository.save(nyBestilling);
    }
    public List<Bestilling> hentBestillingerByMobilnummer(String mobilnummer) {
        return bestillingRepository.findByKunde_Mobilnummer(mobilnummer);
    }
}