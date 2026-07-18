package com.example.components;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class MqttAnmeldePublisher implements AnmeldeObserver {
    private static final Logger log = LoggerFactory.getLogger(MqttAnmeldePublisher.class);

    private final MqttClient mqttClient;

    public MqttAnmeldePublisher(MqttClient mqttClient) {
        this.mqttClient = mqttClient;
    }

    @Override
    public void update() {

        try {
            log.info("[MQTT-PUB] update() received");

            String payload = "anmeldung_gestartet";
            MqttMessage msg = new MqttMessage(payload.getBytes());
            msg.setQos(1);

            log.info("[MQTT-PUB] publishing to topic exams/registration/opened");

            publish("exams/registration/opened", msg);

            log.info("[MQTT-PUB] publish SUCCESS");

        } catch (Exception e) {
            log.error("[MQTT-PUB] ERROR publishing MQTT", e);
        }
    }

    @Override
    public void updateErinnerung() {
        MqttMessage msg = new MqttMessage("anmeldung_endet_bald".getBytes());
        msg.setQos(1);
        publish("exams/registration/reminder", msg);
    }

    private void publish(String topic, MqttMessage msg) {
        try {
            mqttClient.publish(topic, msg);
        } catch (MqttException e) {
            throw new RuntimeException("MQTT publish fehlgeschlagen: " + topic, e);
        }
    }
}
