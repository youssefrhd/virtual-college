package com.example.components;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;


public abstract class SimuliertePruefung {
     private static final Logger log =
            LoggerFactory.getLogger(PruefungsanmeldungSimulator.class);
            
    protected final List<AnmeldeObserver> observers = new ArrayList<>();

    public void attach(AnmeldeObserver o) { observers.add(o); }
    public void detach(AnmeldeObserver o) { observers.remove(o); }

    public void notifyObservers() {
         log.info("[SIMULATOR] Notifying {} observers", observers.size());

        observers.forEach(o -> {
            log.info("[SIMULATOR] → calling {}", o.getClass().getSimpleName());
            o.update();
        });
    }
    
}
