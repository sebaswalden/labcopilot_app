# Laboratory Copilot API Design Document

## Overview
This document outlines the REST API endpoints and WebSocket connections required for the Laboratory Copilot application, covering both the Configuration (Step 1) and Monitoring (Step 2) phases.

> **🚀 Hackathon Demo Scope**: This API design is simplified for rapid prototyping and demo purposes. Authentication, rate limiting, and advanced security features have been excluded to focus on core functionality.

## Base Configuration
- **Base URL**: `https://api.labcopilot.com/v1` (or `http://localhost:3001/v1` for local development)
- **Content-Type**: `application/json` (unless specified otherwise)
- **Authentication**: None required for hackathon demo

---

## Step 1: Configuration Endpoints

### 1.1 Create Task Configuration
**POST** `/tasks/configurations`

Creates a new laboratory task configuration.

> **Note**: This simplified version uses string arrays for chemicals, procedures, and safetyControls to match the current frontend implementation. Additional metadata can be added in future iterations.

#### Request Body
```json
{
  "taskName": "string (required, 1-200 chars)",
  "chemicals": [
    "string (required, chemical name)"
  ],
  "procedures": [
    "string (required, procedure name)"
  ],
  "safetyControls": [
    "string (required, safety control name)"
  ],
  "exposure": {
    "personnelCount": "number (required, min: 1)",
    "estimatedDuration": "number (required, minutes)",
    "durationUnit": "string (required, minutes|hours|days)"
  },
  "additionalNotes": "string (optional, max 1000 chars)",
  "operatorId": "string (required)"
}
```

#### Example Request
```json
{
  "taskName": "Methanol Distillation Process",
  "chemicals": ["Methanol", "Distilled Water", "Sodium Chloride"],
  "procedures": ["Simple Distillation", "Temperature Monitoring", "Fraction Collection"],
  "safetyControls": ["Fume Hood Operation", "Safety Goggles", "Heat-Resistant Gloves", "Fire Extinguisher Ready"],
  "exposure": {
    "personnelCount": 2,
    "estimatedDuration": 120,
    "durationUnit": "minutes"
  },
  "additionalNotes": "Standard methanol purification procedure with temperature monitoring at 64.7°C",
  "operatorId": "user-123"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "configurationId": "uuid",
    "taskName": "string",
    "status": "draft|validated|approved",
    "riskScore": "number (0-100)",
    "warnings": [
      {
        "type": "chemical|procedure|safety|duration",
        "message": "string",
        "severity": "low|medium|high|critical"
      }
    ],
    "recommendations": [
      {
        "category": "safety|efficiency|compliance",
        "message": "string",
        "priority": "low|medium|high"
      }
    ],
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

#### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Configuration validation failed",
    "details": [
      {
        "field": "chemicals",
        "message": "At least one chemical is required"
      }
    ]
  }
}
```

### 1.2 Validate Task Configuration
**POST** `/tasks/configurations/{configurationId}/validate`

Validates configuration against safety database and regulations.

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "isValid": "boolean",
    "riskAssessment": {
      "overallRisk": "low|medium|high|critical",
      "riskFactors": [
        {
          "category": "chemical_compatibility|procedure_safety|exposure_limits",
          "risk": "low|medium|high|critical",
          "description": "string",
          "mitigation": "string"
        }
      ]
    },
    "complianceCheck": {
      "status": "compliant|non_compliant|requires_review",
      "regulations": [
        {
          "name": "OSHA|EPA|DOT",
          "status": "compliant|violation|warning",
          "details": "string"
        }
      ]
    },
    "approvalRequired": "boolean"
  }
}
```

### 1.3 Get Configuration
**GET** `/tasks/configurations/{configurationId}`

Retrieves an existing configuration.

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "configurationId": "uuid",
    "taskName": "string",
    "chemicals": ["string"],
    "procedures": ["string"],
    "safetyControls": ["string"],
    "exposure": {
      "personnelCount": "number",
      "estimatedDuration": "number",
      "durationUnit": "string"
    },
    "additionalNotes": "string",
    "status": "draft|validated|approved|in_progress|completed",
    "createdAt": "ISO 8601 timestamp",
    "updatedAt": "ISO 8601 timestamp"
  }
}
```

### 1.4 Update Configuration
**PUT** `/tasks/configurations/{configurationId}`

Updates an existing configuration (same request body as create).

### 1.5 Get Available References
**GET** `/references/{type}`

Retrieves reference data for autocomplete features.

#### Parameters
- `type`: `chemicals|procedures|safety-controls|lab-locations`
- `query`: Search term (optional)
- `limit`: Number of results (default: 20)

#### Response (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "name": "string (the suggestion text)",
      "category": "string (optional, for grouping)",
      "description": "string (optional, additional info)"
    }
  ]
}
```

---

## Step 2: Monitoring Endpoints

### 2.1 Start Monitoring Session
**POST** `/tasks/{configurationId}/sessions`

Starts a new monitoring session for a validated configuration.

#### Request Body
```json
{
  "operatorId": "string (required)",
  "labLocation": "string (required)",
  "cameraIds": ["string"] // Array of camera identifiers
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "configurationId": "uuid",
    "status": "starting|active|paused|completed|emergency_stopped",
    "startTime": "ISO 8601 timestamp",
    "websocketUrl": "wss://api.labcopilot.com/v1/sessions/{sessionId}/ws",
    "estimatedEndTime": "ISO 8601 timestamp"
  }
}
```

### 2.2 Get Session Status
**GET** `/sessions/{sessionId}`

Retrieves current session information.

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "configurationId": "uuid",
    "status": "starting|active|paused|completed|emergency_stopped",
    "startTime": "ISO 8601 timestamp",
    "endTime": "ISO 8601 timestamp (if completed)",
    "elapsedTime": "number (seconds)",
    "currentProcedure": "string",
    "taskProgress": {
      "completedProcedures": ["string"],
      "currentProcedure": "string",
      "nextProcedures": ["string"],
      "overallProgress": "number (0-100)"
    },
    "safetyStatus": {
      "overallStatus": "safe|warning|danger|emergency",
      "activeAlerts": [
        {
          "id": "uuid",
          "type": "safety|procedure|equipment|environmental",
          "severity": "low|medium|high|critical",
          "message": "string",
          "timestamp": "ISO 8601",
          "acknowledged": "boolean"
        }
      ]
    }
  }
}
```

### 2.3 Update Session Status
**PATCH** `/sessions/{sessionId}`

Updates session status (pause, resume, complete, emergency stop).

#### Request Body
```json
{
  "action": "pause|resume|complete|emergency_stop",
  "reason": "string (optional)",
  "operatorNotes": "string (optional)"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "status": "paused|active|completed|emergency_stopped",
    "timestamp": "ISO 8601 timestamp",
    "notifications": {
      "emailSent": "boolean (true when emergency_stop action triggers email)",
      "recipient": "string (email address, only included for emergency_stop)"
    }
  }
}
```

#### Emergency Stop Behavior
When `action: "emergency_stop"` is triggered:
1. **Immediate Session Termination**: Session status changes to `emergency_stopped`
2. **Email Notification**: Automatic email sent to supervisor/safety officer
3. **Alert Logging**: High-priority safety alert logged in session
4. **WebSocket Broadcast**: Emergency alert sent to all connected clients

#### Emergency Email Template
```
Subject: EMERGENCY STOP - Laboratory Session Alert

Laboratory Session Emergency Stop Activated

Session Details:
- Session ID: {sessionId}
- Task: {taskName}
- Operator: {operatorId}
- Location: {labLocation}
- Time: {timestamp}

Reason: {reason}
Operator Notes: {operatorNotes}
AI Notes: {aiNotes}

Please investigate immediately.

Laboratory Copilot System
```

#### Example Emergency Stop Request
```json
{
  "action": "emergency_stop",
  "reason": "Chemical spill detected",
  "operatorNotes": "Small methanol spill near fume hood. Evacuating area.",
  "emergencyContact": "safety@company.com"
}
```
```

### 2.4 Submit Operator Input
**POST** `/sessions/{sessionId}/operator-input`

Submits operator voice/text input to the AI agent.

#### Request Body
```json
{
  "type": "voice|text",
  "content": "string (transcribed text)",
  "audioUrl": "string (optional, for voice type)",
  "timestamp": "ISO 8601 timestamp"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "inputId": "uuid",
    "processed": "boolean",
    "aiResponse": {
      "responseId": "uuid",
      "content": "string",
      "type": "guidance|warning|acknowledgment|question",
      "actionRequired": "boolean",
      "suggestedActions": ["string"]
    }
  }
}
```

### 2.5 Get Session Logs
**GET** `/sessions/{sessionId}/logs`

Retrieves session activity logs.

#### Parameters
- `since`: ISO 8601 timestamp (optional)
- `type`: `operator_transcript|ai_agent_transcript|ai_agent_interpretation|system` (optional)
- `limit`: Number of logs (default: 50)

#### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "timestamp": "ISO 8601 timestamp",
        "type": "operator_transcript|ai_agent_transcript|ai_agent_interpretation|system",
        "content": "string",
        "metadata": {
          "confidence": "number (0-1, for AI interpretations)",
          "operatorId": "string (for operator transcripts)",
          "responseTime": "number (milliseconds, for AI responses)"
        }
      }
    ],
    "hasMore": "boolean",
    "nextCursor": "string"
  }
}
```

---

## WebSocket Connection

### Connection URL
`wss://api.labcopilot.com/v1/sessions/{sessionId}/ws`

*Note: For hackathon demo, no authentication required*

### Message Types

#### Client → Server Messages

##### Subscribe to Updates
```json
{
  "type": "subscribe",
  "channels": ["logs", "status", "alerts", "ai_responses"]
}
```

##### Send Operator Input
```json
{
  "type": "operator_input",
  "data": {
    "content": "string",
    "inputType": "voice|text",
    "timestamp": "ISO 8601"
  }
}
```

##### Acknowledge Alert
```json
{
  "type": "acknowledge_alert",
  "data": {
    "alertId": "uuid"
  }
}
```

#### Server → Client Messages

##### New Log Entry
```json
{
  "type": "log_entry",
  "data": {
    "id": "uuid",
    "timestamp": "ISO 8601 timestamp",
    "logType": "operator_transcript|ai_agent_transcript|ai_agent_interpretation",
    "content": "string",
    "metadata": {
      "confidence": "number (optional)",
      "operatorId": "string (optional)"
    }
  }
}
```

##### Status Update
```json
{
  "type": "status_update",
  "data": {
    "sessionStatus": "active|paused|completed",
    "elapsedTime": "number (seconds)",
    "currentProcedure": "string",
    "safetyStatus": "safe|warning|danger"
  }
}
```

##### Safety Alert
```json
{
  "type": "safety_alert",
  "data": {
    "alertId": "uuid",
    "severity": "low|medium|high|critical",
    "type": "safety|procedure|equipment|environmental",
    "message": "string",
    "actionRequired": "boolean",
    "suggestedActions": ["string"],
    "timestamp": "ISO 8601"
  }
}
```

##### AI Agent Response
```json
{
  "type": "ai_response",
  "data": {
    "responseId": "uuid",
    "content": "string",
    "responseType": "guidance|warning|acknowledgment|question",
    "actionRequired": "boolean",
    "suggestedActions": ["string"],
    "timestamp": "ISO 8601"
  }
}
```

---

## Security Considerations

### Authentication
- JWT tokens with appropriate expiration
- Refresh token mechanism for long sessions
- Role-based access control (operator, supervisor, admin)

### Data Protection
- All communications over HTTPS/WSS
- Sensitive data encryption at rest
- Audit logging for all actions
- Data retention policies

### Safety Features
- Emergency stop endpoints with high priority
- Automatic session timeout for safety
- Alert escalation to supervisors
- Compliance audit trails
