package frisorbackend.backend.Model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bestilling")
public class Bestilling {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    @ManyToOne
    @JoinColumn(name = "kunde_mobil", referencedColumnName = "mobilnummer")
    private Kunde kunde;

    @Column(nullable = false)
    private LocalDate dato; 

    @Column(nullable = false, length = 5)
    private String tidspunkt;

    
    public Bestilling() {}

    
    public Bestilling(Kunde kunde, LocalDate dato, String tidspunkt) {
        this.kunde = kunde;
        this.dato = dato;
        this.tidspunkt = tidspunkt;
    }

    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Kunde getKunde() { return kunde; }
    public void setKunde(Kunde kunde) { this.kunde = kunde; }

    public LocalDate getDato() { return dato; }
    public void setDato(LocalDate dato) { this.dato = dato; }

    public String getTidspunkt() { return tidspunkt; }
    public void setTidspunkt(String tidspunkt) { this.tidspunkt = tidspunkt; }
}