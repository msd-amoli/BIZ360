package com.biz360.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String password;
    @Column(nullable = false, unique = false)
    private String email;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;


}
