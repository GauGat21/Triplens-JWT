package com.org.Triplens.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    // Builds the signing key from your secret in application.properties
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // Called after login/register — generates a token with userId and email baked
    // in
    public String generateToken(String userId, String email) {
        return Jwts.builder()
                .setSubject(userId) // stored as "sub" claim
                .claim("email", email) // custom claim
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extracts the userId (ObjectId string) from a valid token
    public String extractUserId(String token) {
        return getClaims(token).getSubject();
    }

    // Extracts the email from a valid token
    public String extractEmail(String token) {
        return getClaims(token).get("email", String.class);
    }

    // Returns true if token is valid and not expired
    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // Parses and returns all claims — throws if token is invalid or expired
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
