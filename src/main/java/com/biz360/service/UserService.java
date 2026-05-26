package com.biz360.service;

import com.biz360.dto.UserResponse;
import  org.springframework.stereotype.Service;
import com.biz360.entity.Users;
import com.biz360.entity.Role;
import com.biz360.repository.RoleRepository;
import com.biz360.repository.UserRepository;
import com.biz360.dto.UserRequest;
import org.springframework.data.domain.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }
    public UserResponse createUser(UserRequest userRequest) {
        Role role = roleRepository.findByName(userRequest.getRole())
                .orElseThrow(() -> new RuntimeException("Role Not found"));

        Users user = new Users();
        user.setName(userRequest.getName());
        user.setPassword(userRequest.getPassword());
        user.setEmail(userRequest.getEmail());
        user.setRole(role);

        Users savedUser = userRepository.save(user);

        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole().getName());
        return  response;
    }
/*
    public List<UserResponse>getAllUsers(){

        List<Users>users = userRepository.findAll();

        return users.stream().map(user->{
            UserResponse response = new UserResponse();
            response.setId(user.getId());
            response.setName(user.getName());
            response.setEmail(user.getEmail());
            response.setRole(user.getRole().getName());
            return response;
        }).collect(Collectors.toList());
    }

 */
public Page<UserResponse>getAllUsers(int page, int size,String sortBy,String direction,
String role, String name
){

    Sort sort = direction.equalsIgnoreCase("desc")?Sort.by(sortBy).descending():Sort.by(sortBy).ascending();

   Pageable  pageable = PageRequest.of(page, size,sort);
   Page<Users>usersPage ;
    if (role != null) {
        usersPage = userRepository.findByRole_Name(role, pageable);
    } else if (name != null) {
        usersPage = userRepository.findByNameContainingIgnoreCase(name, pageable);
    } else {
        usersPage = userRepository.findAll(pageable);
    }
    return usersPage.map(user->{
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().getName());
        return response;
    });
}

    public UserResponse getUserById(Long id){
        Users user = userRepository.findById(id).orElseThrow(()->new RuntimeException("User Not Found"));

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().getName());
        return response;
    }
}
