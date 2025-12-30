package frisorbackend.backend.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import frisorbackend.backend.Model.Kunde;

@Repository
public interface KundeRepository extends JpaRepository<Kunde, Long> {
    
   
    List<Kunde> findByNavn(String navn);
    
    List<Kunde> findByEpost(String epost);
    
    List<Kunde> findByNavnContaining(String delAvNavn);
}