package frisorbackend.backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "Kunde") 
public class Kunde {
    
    @Id
    @Column(name = "Mobilnummer")
    private String mobilnummer;
    
    @Column(name = "Navn", nullable = false)
    private String navn;
 
    
    @Column(name = "Epost")
    private String epost;
    

    public Kunde() {}

    public Kunde(String navn, String mobilnummer, String epost) {
        this.navn = navn;
        this.mobilnummer = mobilnummer;
        this.epost = epost;
    }
    

    
    public String getNavn() {
        return navn;
    }
    
    public void setNavn(String navn) {
        this.navn = navn;
    }
    
    public String getMobilnummer() {
        return mobilnummer;
    }
    
    public void setMobilnummer(String mobilnummer) {
        this.mobilnummer = mobilnummer;
    }
    
    public String getEpost() {
        return epost;
    }
    
    public void setEpost(String epost) {
        this.epost = epost;
    }
    
    @Override
    public String toString() {
        return "Kunde{" +
                "kundeId=" +
                ", navn='" + navn + '\'' +
                ", mobilnummer='" + mobilnummer + '\'' +
                ", epost='" + epost + '\'' +
                '}';
    }
}