package com.biz360.config;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import com.biz360.entity.Role;
import com.biz360.repository.RoleRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
         if(roleRepository.findByName("ADMIN").isEmpty()) {
             roleRepository.save(new Role(null,"ADMIN"));
         }
            if (roleRepository.findByName("STAFF").isEmpty()) {
                roleRepository.save(new Role(null, "STAFF"));
            }
        };
    }
}
