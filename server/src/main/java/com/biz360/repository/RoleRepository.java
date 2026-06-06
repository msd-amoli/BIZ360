package com.biz360.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.biz360.entity.Role;
public interface RoleRepository extends JpaRepository<Role, Long>{

    Optional<Role>findByName(String name);
}
