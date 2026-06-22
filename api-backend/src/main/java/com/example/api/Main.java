package com.example.api;




import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        System.out.println("api-backend gestartet ..");
        SpringApplication.run(Main.class, args);

    }
}