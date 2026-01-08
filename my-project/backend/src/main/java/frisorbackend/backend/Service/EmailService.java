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

    // Denne henter automatisk verdien fra Render (miljøvariabelen)
    @Value("${SENDGRID_API_KEY}")
    private String sendGridApiKey;

    public void sendVerifiseringsKode(String tilEpost, String kode) {
        // VIKTIG: Denne e-posten må være nøyaktig den du verifiserte i SendGrid
        Email from = new Email("bergenfrisorr@gmail.com"); 
        String subject = "Verifiseringskode - Bergen Frisør";
        Email to = new Email(tilEpost);
        Content content = new Content("text/plain", "Hei!\n\nDin kode for Bergen Frisør er: " + kode);
        
        Mail mail = new Mail(from, subject, to, content);
        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            System.out.println("SendGrid Status: " + response.getStatusCode());
        } catch (IOException ex) {
            System.err.println("FEIL ved sending: " + ex.getMessage());
        }
    }
}