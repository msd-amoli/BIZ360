package com.biz360.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.biz360.entity.Users;
import org.springframework.data.domain.*;
public interface UserRepository extends JpaRepository<Users, Long> {
Optional<Users>findByEmail(String email);

Page<Users>findByRole_Name(String roleName,Pageable pageable);
Page<Users>findByNameContainingIgnoreCase(String name,Pageable pageable);

}
