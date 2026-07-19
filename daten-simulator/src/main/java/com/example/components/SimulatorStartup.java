package com.example.components;

import java.time.ZoneId;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Component;

@Component
public class SimulatorStartup implements ApplicationRunner {
    private final PruefungsanmeldungSimulator simulator;
    private final MqttAnmeldePublisher publisher;
    private final TaskScheduler taskScheduler;

    public SimulatorStartup(PruefungsanmeldungSimulator simulator, MqttAnmeldePublisher publisher,
            TaskScheduler taskScheduler) {
        this.simulator = simulator;
        this.publisher = publisher;
        this.taskScheduler = taskScheduler;
    }

    @Override
    public void run(ApplicationArguments args) {
        simulator.attach(publisher);

        System.out.println("ANMELDE_START = "
                + AnmeldeKonstanten.ANMELDE_START);

        System.out.println("JETZT = "
                + java.time.LocalDateTime.now());

        taskScheduler.schedule(
                simulator::pruefeStart,
                AnmeldeKonstanten.ANMELDE_START
                        .atZone(ZoneId.systemDefault())
                        .toInstant());
        

        taskScheduler.schedule(
            simulator::pruefeErinnerung,
            AnmeldeKonstanten.ERINNERUNGS_ZEITPUNKT
                .atZone(ZoneId.systemDefault()).toInstant()
        );
    }
}
