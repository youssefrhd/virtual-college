package com.example.components;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class PruefungsanmeldungSimulator extends SimuliertePruefung {
    private static final Logger log =
            LoggerFactory.getLogger(PruefungsanmeldungSimulator.class);
    
    public void pruefeStart() {
         log.info("[SIMULATOR] Tick: {}", LocalDateTime.now());

        if (!LocalDateTime.now().isBefore(AnmeldeKonstanten.ANMELDE_START)) {

            log.info("[SIMULATOR] START ZEIT ERREICHT → notifyObservers()");
            notifyObservers();
        }
    }

     public void pruefeErinnerung() {
        if (!LocalDateTime.now().isBefore(AnmeldeKonstanten.ERINNERUNGS_ZEITPUNKT)) {
            notifyErinnerung();
        }
    }
}
