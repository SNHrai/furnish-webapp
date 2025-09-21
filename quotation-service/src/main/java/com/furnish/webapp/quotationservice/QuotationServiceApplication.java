package com.furnish.webapp.quotationservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class QuotationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuotationServiceApplication.class, args);
    }
}