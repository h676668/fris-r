package frisorbackend.backend.Model;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "bestilling")
public class Bestilling {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "kunde_mobil", referencedColumnName = "mobilnummer")
    @NotNull(message = "Bestillingen må være knyttet til en kunde")
    @Valid // Validerer at kunden som følger med også oppfyller sine krav (8 siffer osv)
    private Kunde kunde;

    @Column(nullable = false)
    @NotNull(message = "Dato må oppgis")
    @FutureOrPresent(message = "Dato kan ikke være i fortiden")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dato; 

    @Column(nullable = false, length = 5)
    @NotBlank(message = "Tidspunkt må oppgis")
    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Tidspunkt må være på formatet HH:mm")
    private String tidspunkt;

    // Standard konstruktør (påkrevd av JPA)
    public Bestilling() {}

    // Konstruktør med felt
    public Bestilling(Kunde kunde, LocalDate dato, String tidspunkt) {
        this.kunde = kunde;
        this.dato = dato;
        this.tidspunkt = tidspunkt;
    }

    // Getters og Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Kunde getKunde() { return kunde; }
    public void setKunde(Kunde kunde) { this.kunde = kunde; }

    public LocalDate getDato() { return dato; }
    public void setDato(LocalDate dato) { this.dato = dato; }

    public String getTidspunkt() { return tidspunkt; }
    public void setTidspunkt(String tidspunkt) { this.tidspunkt = tidspunkt; }
}