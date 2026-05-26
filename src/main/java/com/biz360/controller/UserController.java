package com.biz360.controller;

import com.biz360.dto.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.data.domain.*;
import jakarta.validation.Valid;
import com.biz360.service.UserService;
import com.biz360.dto.UserRequest;
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public UserResponse createUser(@Valid @RequestBody UserRequest userRequest) {
        return userService.createUser(userRequest);
    }

//    @GetMapping
//    public List<UserResponse> getUsers() {
//        return userService.getAllUsers();
//    }

    @GetMapping
    public Page<UserResponse>getAllUsers(@RequestParam(defaultValue="0") int page,
                                         @RequestParam(defaultValue = "5")int size,
                                         @RequestParam(defaultValue = "id")String sortBy,
                                         @RequestParam(defaultValue = "asc") String direction,
                                         @RequestParam(required = false) String role,
                                         @RequestParam(required = false) String name){
        return userService.getAllUsers(page,size,sortBy,direction,role,name);
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id){
        return userService.getUserById(id);
    }
}
