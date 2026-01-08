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
        Email from = new Email("bergenfrisorr@gmail.com"); 
        String subject = "Bekreft din bestilling - Bergen Frisør";
        Email to = new Email(tilEpost);
        
        // Teksten du valgte
        String tekstInnhold = "Hei!\n\n" +
                             "Din kode for å bekrefte bestillingen hos Bergen Frisør er: " + kode + "\n\n" +
                             "Tast inn denne koden på nettsiden for å fullføre bookingen.\n\n" +
                             "Med vennlig hilsen,\n" +
                             "Bergen Frisør";

        Content content = new Content("text/plain", tekstInnhold);
        Mail mail = new Mail(from, subject, to, content);
        mail.setReplyTo(new Email("bergenfrisorr@gmail.com"));

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            
            System.out.println("SendGrid Status: " + response.getStatusCode());
        } catch (IOException ex) {
            System.err.println("Feil ved sending: " + ex.getMessage());
        }
    }
}