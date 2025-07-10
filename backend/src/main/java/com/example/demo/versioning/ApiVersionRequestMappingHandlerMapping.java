package com.example.demo.versioning;

import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.web.servlet.mvc.condition.RequestCondition;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.lang.reflect.Method;

/**
 * Custom handler mapping to process @ApiVersion annotations
 * and create appropriate request conditions
 */
public class ApiVersionRequestMappingHandlerMapping extends RequestMappingHandlerMapping {
    
    @Override
    protected RequestCondition<?> getCustomTypeCondition(Class<?> handlerType) {
        ApiVersion apiVersion = AnnotationUtils.findAnnotation(handlerType, ApiVersion.class);
        return apiVersion == null ? null : new ApiVersionCondition(apiVersion.value());
    }
    
    @Override
    protected RequestCondition<?> getCustomMethodCondition(Method method) {
        ApiVersion apiVersion = AnnotationUtils.findAnnotation(method, ApiVersion.class);
        return apiVersion == null ? null : new ApiVersionCondition(apiVersion.value());
    }
}
