package frisorbackend.backend.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import frisorbackend.backend.Exception.KundeIkkeFunnetException;
import frisorbackend.backend.Model.Kunde;
import frisorbackend.backend.Repository.KundeRepository;

@Service
public class KundeService{

    private final KundeRepository kundeRepository ;

    @Autowired
    public KundeService(KundeRepository kundeRepository){
        this.kundeRepository=kundeRepository;
    }

    public Kunde hentKundeEttermobil(String mobilnummer) throws KundeIkkeFunnetException {
        return kundeRepository
                .findById(mobilnummer)
                .orElseThrow(() -> new KundeIkkeFunnetException(mobilnummer));
    }

    public Kunde leggNyKunde(String mobilnummer , String navn , String epost){
        Kunde kunde = new Kunde (mobilnummer, navn ,epost );
        return kundeRepository.save(kunde);
    }

    







}