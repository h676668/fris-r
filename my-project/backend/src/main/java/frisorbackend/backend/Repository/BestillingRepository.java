package frisorbackend.backend.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import frisorbackend.backend.Model.Bestilling;

@Repository
public interface BestillingRepository extends JpaRepository<Bestilling, Long> {

    // Denne metoden lar deg hente alle bestillinger for et spesifikt mobilnummer
    // Spring Boot skjønner automatisk at den skal gå via 'kunde' -> 'mobilnummer'
    List<Bestilling> findByKundeMobilnummer(String mobilnummer);
    
    // Du kan også finne alle bestillinger for en spesifikk dato
    List<Bestilling> findByDato(java.time.LocalDate dato);


    boolean existsByDatoAndTidspunkt(LocalDate dato, String tidspunkt);

    List<Bestilling> findByKunde_Mobilnummer(String mobilnummer);
}
