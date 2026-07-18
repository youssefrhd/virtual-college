package com.example.api.mqtt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;

import com.example.api.benachrichtigung.BenachrichtigungService;

@Component
public class MqttAnmeldeSubscriber {
    private static final Logger log = LoggerFactory.getLogger(MqttAnmeldeSubscriber.class);

    private final BenachrichtigungService benachrichtigungService;

    public MqttAnmeldeSubscriber(BenachrichtigungService benachrichtigungService) {
        this.benachrichtigungService = benachrichtigungService;
    }

    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void handleAnmeldungGestartet(Message<?> message) {

        log.info("====================================");
        log.info("[MQTT-IN] Nachricht empfangen");
        log.info("[MQTT-IN] Headers: {}", message.getHeaders());

        Object rawPayload = message.getPayload();
        log.info("[MQTT-IN] Raw Payload: {}", rawPayload);

        String payload = String.valueOf(rawPayload).trim();

        log.info("[MQTT-IN] Parsed Payload: '{}'", payload);

        switch (payload) {

            case "anmeldung_gestartet" -> {
                log.info("[MQTT-IN] Trigger erkannt → sende Notifications");

                try {
                    benachrichtigungService.sendeAnmeldestartAnAlleStudenten();
                    log.info("[MQTT-IN] Notifications erfolgreich gesendet");
                } catch (Exception e) {
                    log.error("[MQTT-IN] Fehler beim Senden der Notifications", e);
                }
            }

            case "anmeldung_endet_bald" -> {
                benachrichtigungService.sendeAnmeldeendeErinnerungAnAlleStudenten();
                log.info("Anmeldeende-Erinnerungen gesendet.");
            }

            default ->
            log.warn("[MQTT-IN] Unbekannte MQTT Nachricht: {}", payload);
        }

       
        log.info("====================================");
    }
}
