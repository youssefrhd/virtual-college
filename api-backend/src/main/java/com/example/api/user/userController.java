package com.example.api.user;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me")
public class userController {
    
    @GetMapping
    public String profile(){
        return "Profile EndPunkt";
    }
}
