# API Versioning Implementation

This Todo API implements **header-based versioning** allowing clients to specify which version of the API they want to use without changing URLs.

## 🎯 Versioning Methods

### Method 1: API-Version Header (Recommended)
```http
GET /api/
API-Version: v1
```

### Method 2: Accept Header with Custom Media Type
```http
GET /api/
Accept: application/vnd.todoapi.v1+json
```

### Method 3: Default Behavior
If no version is specified, the API defaults to **v1** for backward compatibility.

## 📋 API Versions

### Version 1 (v1) - Basic CRUD
- **Backward compatible** with existing clients
- Simple responses
- Basic error handling

#### Endpoints:
```
GET    /api/           - List all tasks
POST   /api/tasks      - Create new task  
POST   /api/delete     - Delete task
```

#### Example Request:
```bash
curl -X GET http://localhost:8080/api/ \
  -H "API-Version: v1" \
  -H "Content-Type: application/json"
```

#### Example Response:
```json
[
  {
    "taskdescription": "Buy groceries"
  },
  {
    "taskdescription": "Walk the dog"
  }
]
```

### Version 2 (v2) - Enhanced Features
- **Enhanced task objects** with IDs and timestamps
- **Proper HTTP status codes** (201, 404, 409, etc.)
- **Detailed error responses**
- **Response metadata**
- **Task status tracking**

#### Endpoints:
```
GET    /api/           - List all tasks (with metadata)
POST   /api/tasks      - Create new task (with enhanced response)
POST   /api/delete     - Delete task (with enhanced response)
GET    /api/version    - Get version information (v2 only)
```

#### Example Request:
```bash
curl -X GET http://localhost:8080/api/ \
  -H "API-Version: v2" \
  -H "Content-Type: application/json"
```

#### Example Response:
```json
{
  "version": "v2",
  "timestamp": "2025-01-10T09:45:00",
  "count": 2,
  "tasks": [
    {
      "id": 1,
      "taskdescription": "Buy groceries",
      "status": "open",
      "createdAt": "2025-01-10T09:30:00",
      "updatedAt": "2025-01-10T09:30:00"
    },
    {
      "id": 2,
      "taskdescription": "Walk the dog", 
      "status": "open",
      "createdAt": "2025-01-10T09:35:00",
      "updatedAt": "2025-01-10T09:35:00"
    }
  ]
}
```

## 🔧 Testing Different Versions

### Using curl:

**Version 1:**
```bash
# Get tasks (v1)
curl -X GET http://localhost:8080/api/ -H "API-Version: v1"

# Create task (v1)
curl -X POST http://localhost:8080/api/tasks \
  -H "API-Version: v1" \
  -H "Content-Type: application/json" \
  -d '{"taskdescription": "Test task v1"}'
```

**Version 2:**
```bash
# Get tasks (v2)
curl -X GET http://localhost:8080/api/ -H "API-Version: v2"

# Create task (v2)
curl -X POST http://localhost:8080/api/tasks \
  -H "API-Version: v2" \
  -H "Content-Type: application/json" \
  -d '{"taskdescription": "Test task v2"}'

# Get version info (v2 only)
curl -X GET http://localhost:8080/api/version -H "API-Version: v2"
```

### Using Accept Header:
```bash
# Version 1
curl -X GET http://localhost:8080/api/ \
  -H "Accept: application/vnd.todoapi.v1+json"

# Version 2  
curl -X GET http://localhost:8080/api/ \
  -H "Accept: application/vnd.todoapi.v2+json"
```

## 🏗️ Implementation Details

### Components:
1. **@ApiVersion** - Annotation to mark controller methods/classes with version
2. **ApiVersionCondition** - Custom request condition to match versions from headers
3. **ApiVersionRequestMappingHandlerMapping** - Handler mapping to process @ApiVersion annotations
4. **WebConfig** - Configuration to register custom handler mapping
5. **TodoControllerV1** - Version 1 implementation
6. **TodoControllerV2** - Version 2 implementation

### Version Resolution Order:
1. Check `API-Version` header
2. Check `Accept` header for custom media type
3. Default to `v1` if no version specified

## 🔄 Migration Guide

### From v1 to v2:
- **Responses**: Expect structured responses with metadata instead of direct arrays
- **Status Codes**: Handle proper HTTP status codes (201, 404, 409, etc.)
- **Task Objects**: Tasks now include `id`, `status`, `createdAt`, `updatedAt`
- **Error Handling**: Enhanced error responses with detailed information

### Backward Compatibility:
- v1 API remains unchanged and functional
- Existing clients continue to work without modifications
- New clients can opt into v2 features by setting appropriate headers

## 🎉 Benefits

1. **URL Stability** - No URL changes required for versioning
2. **Backward Compatibility** - Old clients continue to work
3. **Flexible** - Multiple ways to specify version
4. **Clean** - Version logic is contained in controllers
5. **Extensible** - Easy to add new versions (v3, v4, etc.)
