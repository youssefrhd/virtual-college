package com.example.api.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.api.user.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

        private final JwtAuthFilter jwtAuthFilter;
        private final UserDetailsServiceImpl userDetailsService;

        public SecurityConfig(JwtAuthFilter jwtAuthFilter,
                        UserDetailsServiceImpl userDetailsService) {
                this.jwtAuthFilter = jwtAuthFilter;
                this.userDetailsService = userDetailsService;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                return http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable())

                                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                                .authorizeHttpRequests(auth -> auth

                                                .requestMatchers(
                                                                "/api/auth/**",
                                                                "/error",
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/v3/api-docs/**",
                                                                "/v3/api-docs/swagger-config")
                                                .permitAll()

                                                .requestMatchers(
                                                                "/api/student",
                                                                "/api/student/**",
                                                                "/api/studienfortschritt/**")
                                                .hasAnyRole("STUDENT")
                                                .requestMatchers(
                                                                "/api/professor/**",
                                                                "/api/module/**",
                                                                "/api/pruefungen/**",
                                                                "/api/materialien/upload",
                                                                "/api/materialien/delete/**")
                                                .hasAnyRole("PROFESSOR")

                                                .requestMatchers(
                                                                "/api/noten/**",
                                                                "/api/pruefungsanmeldungen/**",
                                                                "/api/materialien/download/**",
                                                                "/api/benachrichtigungen/**")
                                                .hasAnyRole("STUDENT", "PROFESSOR")

                                                .anyRequest().authenticated())

                                .authenticationProvider(authenticationProvider())
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                                .build();
        }

        @Bean
    public CorsConfigurationSource corsConfigurationSource() {
 
        CorsConfiguration config = new CorsConfiguration();
 
        config.setAllowedOrigins(List.of( 
            "http://localhost:3000"   
        ));
 
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);   
        config.setMaxAge(3600L);
 
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder(12);
        }

        @Bean
        public AuthenticationProvider authenticationProvider() {
                DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);

                provider.setPasswordEncoder(passwordEncoder());

                return provider;
        }

        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }
}
