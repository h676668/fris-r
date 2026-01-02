package frisorbackend.backend.Service;

// DISSE IMPORTENE MANGLER DU:
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerifiseringsKode(String tilEpost, String kode) {
        SimpleMailMessage melding = new SimpleMailMessage();
        
        // Slik ser det profesjonelt ut i innboksen
        melding.setFrom("Bergen Frisør <bergenfrisor@gmail.com>");
        melding.setTo(tilEpost);
        melding.setSubject("Verifiseringskode - Bergen Frisør");
        melding.setText("Hei!\n\nDin kode for å bekrefte bestillingen hos Bergen Frisør er: " + kode + 
                       "\n\nTast inn denne koden på nettsiden for å fullføre bookingen.\n\nMed vennlig hilsen,\nBergen Frisør");

        try {
            mailSender.send(melding);
            System.out.println("Suksess: Kode sendt til " + tilEpost);
        } catch (Exception e) {
            System.err.println("FEIL: Kunne ikke sende e-post: " + e.getMessage());
        }
    }
}