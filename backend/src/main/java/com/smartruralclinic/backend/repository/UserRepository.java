package com.smartruralclinic.backend.repository;

import com.smartruralclinic.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByIdNumber(String idNumber);

    long countByRoleIn(List<String> roles);
}