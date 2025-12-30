package frisorbackend.backend.Exception;

public class KundeIkkeFunnetException extends RuntimeException {

    public KundeIkkeFunnetException(String mobilnummer) {
        super( "Kunde med mobilnummer " + mobilnummer + " ble ikke funnet");
    }
}
