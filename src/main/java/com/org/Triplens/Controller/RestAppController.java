package com.org.Triplens.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.org.Triplens.Services.UserService;
import com.org.Triplens.entity.Users;
import com.org.Triplens.exception.NoUserFoundException;
import com.org.Triplens.exception.PasswordIncorrectException;
import com.org.Triplens.security.JwtUtil;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/users")
public class RestAppController {

    @Autowired
    UserService userService;

    @Autowired
    JwtUtil jwtUtil;

    @PostMapping("/addUser")
    public boolean addUsers(@RequestParam("name") String name,
                            @RequestParam("email") String email,
                            @RequestParam("password") String password) {
        return userService.addUsers(name, password, email);
    }

    @PostMapping("/finduser")
    public Users findUser(@RequestParam("email") String email) {
        try {
            return userService.findUsers(email);
        } catch (NoUserFoundException e) {
            System.out.println("No such User");
            e.printStackTrace();
        }
        return null;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestParam("email") String email,
                                          @RequestParam("password") String password) {
        try {
            boolean valid = userService.authenticate(email, password);
            if (valid) {
                Users user = userService.findUsers(email);
                String token = jwtUtil.generateToken(
                    user.getObjectId().toString(),
                    user.getEmail()
                );
                return ResponseEntity.ok(Map.of(
                    "token",    token,
                    "userId",   user.getObjectId().toString(),
                    "userName", user.getUserName(),
                    "email",    user.getEmail()
                ));
            }
            return ResponseEntity.status(401).body("Invalid credentials");
        } catch (NoUserFoundException e) {
            return ResponseEntity.status(401).body("User not found");
        } catch (PasswordIncorrectException e) {
            return ResponseEntity.status(401).body("Password incorrect");
        }
    }
}