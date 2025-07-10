package com.example.demo.versioning;

import org.springframework.web.servlet.mvc.condition.RequestCondition;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Custom request condition to match API version from headers
 * Looks for 'API-Version' header or 'Accept' header with version info
 */
public class ApiVersionCondition implements RequestCondition<ApiVersionCondition> {
    
    private final String version;
    
    public ApiVersionCondition(String version) {
        this.version = version;
    }
    
    @Override
    public ApiVersionCondition combine(ApiVersionCondition other) {
        // Use the more specific version (method-level over class-level)
        return new ApiVersionCondition(other.version);
    }
    
    @Override
    public ApiVersionCondition getMatchingCondition(HttpServletRequest request) {
        // Check API-Version header first
        String requestVersion = request.getHeader("API-Version");
        
        // If no API-Version header, check Accept header for version info
        if (requestVersion == null) {
            String acceptHeader = request.getHeader("Accept");
            if (acceptHeader != null && acceptHeader.contains("application/vnd.todoapi.")) {
                // Extract version from Accept header like "application/vnd.todoapi.v1+json"
                String[] parts = acceptHeader.split("\\.");
                for (String part : parts) {
                    if (part.startsWith("v") && part.length() > 1) {
                        requestVersion = part.split("\\+")[0]; // Remove +json if present
                        break;
                    }
                }
            }
        }
        
        // Default to v1 if no version specified
        if (requestVersion == null) {
            requestVersion = "v1";
        }
        
        System.out.println("ApiVersionCondition: controller=" + this.version + ", request=" + requestVersion + ", match=" + this.version.equals(requestVersion));
        return this.version.equals(requestVersion) ? this : null;
    }
    
    @Override
    public int compareTo(ApiVersionCondition other, HttpServletRequest request) {
        // Prefer higher versions (v2 over v1)
        return other.version.compareTo(this.version);
    }
    
    public String getVersion() {
        return version;
    }
}
