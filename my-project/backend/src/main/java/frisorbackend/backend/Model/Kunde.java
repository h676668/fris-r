package frisorbackend.backend.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "Kunde") 
public class Kunde {
    
    @Id
    @Column(name = "Mobilnummer")
    @NotBlank(message = "Mobilnummer må fylles ut")
    @Pattern(regexp = "^\\d{8}$", message = "Mobilnummer må være nøyaktig 8 siffer")
    private String mobilnummer;
    
    @Column(name = "Navn", nullable = false)
    @NotBlank(message = "Navn må fylles ut")
    @Size(min = 2, max = 100, message = "Navn må være mellom 2 og 100 tegn")
    private String navn;
 
    @Column(name = "Epost", unique = true, nullable = false)
    @NotBlank(message = "E-post må fylles ut")
    @Email(message = "Ugyldig e-postformat")
    private String epost;
    

   
    public Kunde() {}

   
    public Kunde(String mobilnummer, String navn, String epost) {
        this.mobilnummer = mobilnummer;
        this.navn = navn;
        this.epost = epost;
    }
    
    // Getters og Setters
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
                "mobilnummer='" + mobilnummer + '\'' +
                ", navn='" + navn + '\'' +
                ", epost='" + epost + '\'' +
                '}';
    }
}