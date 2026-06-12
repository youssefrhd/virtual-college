package com.example.api.authentification;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class authController {

    @PostMapping("/register")
    public String register(){
        return "Register EndPunkt funktioniert";
    }
    @PostMapping("/login")
    public String login(){
        return "Login Endpunkt";
    }
    @PostMapping("/reset-password")
    public String resetPassword(){
        return "Reset Password Endpunkt";
    }

    
}
