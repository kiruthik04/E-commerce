package com.ecommerce.pricing.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.security.Key;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Value("${jwt.secret}") private String jwtSecret;
    private Key key() { return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret)); }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        try {
            String jwt = parseJwt(req);
            if (jwt != null) {
                Claims claims = Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(jwt).getBody();
                Long userId = claims.get("userId", Long.class);
                String role = claims.get("role", String.class);
                if (userId != null) {
                    SimpleGrantedAuthority auth = new SimpleGrantedAuthority(role != null ? role : "ROLE_CUSTOMER");
                    UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(userId, null, Collections.singletonList(auth));
                    token.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                    SecurityContextHolder.getContext().setAuthentication(token);
                }
            }
        } catch (Exception ignored) {}
        chain.doFilter(req, res);
    }

    private String parseJwt(HttpServletRequest req) {
        String h = req.getHeader("Authorization");
        return (StringUtils.hasText(h) && h.startsWith("Bearer ")) ? h.substring(7) : null;
    }
}
