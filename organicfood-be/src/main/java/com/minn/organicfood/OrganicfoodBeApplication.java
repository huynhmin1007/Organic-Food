package com.minn.organicfood;

import com.minn.organicfood.identity.config.JwtProperties;
import com.minn.organicfood.identity.config.RsaKeyProperties;
import com.minn.organicfood.media.insfra.cloudinary.CloudinaryProperties;
import com.minn.organicfood.notification.infra.BrevoProperties;
import com.minn.organicfood.shared.config.SecurityProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({
        SecurityProperties.class, BrevoProperties.class, CloudinaryProperties.class,
        JwtProperties.class, RsaKeyProperties.class
})
public class OrganicfoodBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrganicfoodBeApplication.class, args);
    }

}
