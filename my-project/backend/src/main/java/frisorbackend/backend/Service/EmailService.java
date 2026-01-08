package frisorbackend.backend.Service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.IOException;

@Service
public class EmailService {

    @Value("${SENDGRID_API_KEY}")
    private String sendGridApiKey;

    public void sendVerifiseringsKode(String tilEpost, String kode) {
        // Avsender må være nøyaktig den du verifiserte i SendGrid
        Email from = new Email("bergenfrisorr@gmail.com"); 
        String subject = "Din verifiseringskode fra Bergen Frisør";
        Email to = new Email(tilEpost);
        
        // Vi bruker en litt fyldigere tekst for å unngå spam-filteret
        String tekstInnhold = "Hei!\n\n" +
                             "Takk for at du bruker Bergen Frisør. Din verifiseringskode er:\n\n" +
                             "** " + kode + " **\n\n" +
                             "Skriv inn denne koden i appen for å fullføre din registrering.\n" +
                             "Hvis du ikke har bedt om denne koden, kan du trygt se bort fra denne e-posten.\n\n" +
                             "Vennlig hilsen,\n" +
                             "Bergen Frisør";

        Content content = new Content("text/plain", tekstInnhold);
        Mail mail = new Mail(from, subject, to, content);
        
        // Legger til en Reply-To for å virke mer seriøs overfor Gmail
        mail.setReplyTo(new Email("bergenfrisorr@gmail.com"));

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            
            // Logger resultatet så du kan se det i Render-loggen
            System.out.println("SendGrid Status: " + response.getStatusCode());
            if (response.getStatusCode() >= 400) {
                System.err.println("SendGrid feilmelding: " + response.getBody());
            }
        } catch (IOException ex) {
            System.err.println("Kritisk feil ved sending av e-post: " + ex.getMessage());
        }
    }
}