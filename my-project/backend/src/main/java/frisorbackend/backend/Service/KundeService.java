package frisorbackend.backend.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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







}