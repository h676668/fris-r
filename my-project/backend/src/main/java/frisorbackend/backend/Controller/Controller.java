package frisorbackend.backend.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import frisorbackend.backend.Model.Kunde;
import frisorbackend.backend.Repository.KundeRepository;

@RestController
public class Controller {

       @Autowired
    private KundeRepository kundeRepository;

    @GetMapping("/test")
    public String test() {
        return "yees";
    }


      @GetMapping("alle")
    public List<Kunde> getAllKunder() {
        return kundeRepository.findAll();
    }
}
