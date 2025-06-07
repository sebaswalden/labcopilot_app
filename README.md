# Laboratory Copilot

A React-based AI-powered assistant for chemical laboratory operations, providing configuration management and real-time safety monitoring.

<img width="1800" alt="image" src="https://github.com/user-attachments/assets/7974b0da-41a6-4097-a137-667a9647c8f0" />
<img width="1786" alt="image" src="https://github.com/user-attachments/assets/22a21f0a-af0c-4afa-be07-57b590d27d17" />


## 🧪 Overview

Laboratory Copilot is a two-step application that helps laboratory operators:

1. **Step 1 - Configuration**: Set up laboratory tasks with chemicals, procedures, safety controls, and exposure parameters
2. **Step 2 - Monitoring**: Real-time monitoring with AI assistance, live feed analysis, and safety compliance tracking

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:sebaswalden/labcopilot_app.git
   cd labcopilot_app
   ```

2. **Install dependencies**
   ```bash
   npm i
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🎨 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn/ui
- **Routing**: React Router v6
- **Icons**: Lucide React

## 🔧 Configuration

### Environment Variables

**NOT YET IMPLEMENTED**

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=https://api.labcopilot.com/v1
VITE_WS_BASE_URL=wss://api.labcopilot.com/v1

# Development settings
VITE_ENVIRONMENT=development
VITE_LOG_LEVEL=debug

# Camera/Video settings
VITE_CAMERA_API_URL=https://camera-api.labcopilot.com
```

## 📱 Application Features

### Step 1: Configuration Form
- **Task Setup**: Name and describe laboratory tasks
- **Chemical Management**: Add/remove chemicals
- **Procedure Planning**: Define laboratory procedures and techniques to be performed
- **Safety Controls**: Specify required safety equipment and measures to be used
- **Exposure Settings**: Set personnel count and time limits

### Step 2: Monitoring Dashboard
- **Live Feed**: Real-time laboratory camera monitoring
- **Activity Logs**: Three types of logs:
  - Operator Transcript (voice-to-text)
  - AI Agent Responses
  - AI Visual Interpretation
- **Task Tracking**: Monitor progress, chemicals, procedures, and safety
- **Timer**: Real-time elapsed time with progress indicators

## 🔗 API Integration

The application is designed to integrate with a backend API. See the [API Design Document](./docs/api-design.md) for complete endpoint specifications.

### Key Integration Points:

1. **Configuration Submission**: POST to `/tasks/configurations`
2. **Session Management**: POST to `/tasks/{id}/sessions`
3. **Real-time Updates**: WebSocket connection to `/sessions/{id}/ws`
4. **Log Streaming**: GET from `/sessions/{id}/logs`

## 📦 Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy static files** from `dist/` directory

## 📋 Roadmap

- [ ] **Backend Integration**: Connect to real API endpoints
- [ ] **Real-time WebSocket**: Live data streaming
- [ ] **Camera Integration**: Actual video feed processing
- [ ] **Voice Recognition**: Speech-to-text for operator input

**Built with ❤️ for laboratory safety and efficiency**
