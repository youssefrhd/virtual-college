package com.example.components;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class MqttAnmeldePublisher implements AnmeldeObserver {
    private static final Logger log =
            LoggerFactory.getLogger(MqttAnmeldePublisher.class);
            
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

            mqttClient.publish("exams/registration/opened", msg);

            log.info("[MQTT-PUB] publish SUCCESS");

        } catch (Exception e) {
            log.error("[MQTT-PUB] ERROR publishing MQTT", e);
        }
    }
    }

