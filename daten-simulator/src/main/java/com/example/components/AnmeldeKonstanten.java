package com.example.components;

import java.time.LocalDateTime;

public class AnmeldeKonstanten {
    public static final LocalDateTime ANMELDE_START =
        LocalDateTime.now().plusMinutes(1);


     public static final LocalDateTime ANMELDE_ENDE =
        LocalDateTime.now();
 
    public static final LocalDateTime ERINNERUNGS_ZEITPUNKT =
        ANMELDE_ENDE.minusDays(2);
    
}
