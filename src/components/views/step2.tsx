import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Camera,
  Clock,
  AlertTriangle,
  Shield,
  FlaskConical,
  User,
  Bot,
  Eye,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Type definitions for logs
interface LogEntry {
  id: string;
  timestamp: Date;
  type:
    | "operator_transcript"
    | "ai_agent_transcript"
    | "ai_agent_interpretation";
  content: string;
  confidence?: number; // For AI interpretations
}

// Type definitions for task information
interface TaskInfo {
  taskName: string;
  chemicals: string[];
  procedures: string[];
  safetyControls: string[];
  estimatedDuration: number; // in minutes
  startTime: Date;
  status: "not_started" | "in_progress" | "completed" | "paused";
}

const LabMonitoringDashboard: React.FC = () => {
  // Mock task data for methanol distillation
  const [taskInfo] = useState<TaskInfo>({
    taskName: "Methanol Distillation Process",
    chemicals: ["Methanol", "Distilled Water", "Sodium Chloride"],
    procedures: [
      "Simple Distillation",
      "Temperature Monitoring",
      "Fraction Collection",
    ],
    safetyControls: [
      "Fume Hood Operation",
      "Safety Goggles",
      "Heat-Resistant Gloves",
      "Fire Extinguisher Ready",
    ],
    estimatedDuration: 120, // 2 hours
    startTime: new Date(Date.now() - 25 * 60 * 1000), // Started 25 minutes ago
    status: "in_progress",
  });

  // Mock log entries
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 24 * 60 * 1000),
      type: "operator_transcript",
      content:
        "Starting the methanol distillation setup. Setting up the distillation apparatus now.",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 23 * 60 * 1000),
      type: "ai_agent_transcript",
      content:
        "Understood. Please ensure the fume hood is operational and verify all glassware connections are secure before proceeding.",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 22 * 60 * 1000),
      type: "ai_agent_interpretation",
      content:
        "Operator is connecting round-bottom flask to distillation column. Setup appears correct.",
      confidence: 0.89,
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      type: "operator_transcript",
      content:
        "Fume hood is running, all connections checked. Adding methanol to the flask now.",
    },
    {
      id: "5",
      timestamp: new Date(Date.now() - 17 * 60 * 1000),
      type: "ai_agent_transcript",
      content:
        "Good. Monitor the methanol volume and ensure it doesn't exceed 2/3 of the flask capacity. What's the current temperature reading?",
    },
    {
      id: "6",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: "ai_agent_interpretation",
      content:
        "Operator wearing appropriate safety equipment. Methanol being poured carefully into apparatus.",
      confidence: 0.94,
    },
    {
      id: "7",
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      type: "operator_transcript",
      content: "Temperature is at 55°C. Should I increase the heating rate?",
    },
    {
      id: "8",
      timestamp: new Date(Date.now() - 11 * 60 * 1000),
      type: "ai_agent_transcript",
      content:
        "Maintain current heating rate. Methanol boiling point is 64.7°C. Gradual heating ensures better separation.",
    },
    {
      id: "9",
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      type: "ai_agent_interpretation",
      content:
        "First distillate drops visible in receiving flask. Distillation proceeding normally.",
      confidence: 0.91,
    },
    {
      id: "10",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: "operator_transcript",
      content: "Getting steady drip rate now. Collecting the first fraction.",
    },
  ]);

  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor(
          (now.getTime() - taskInfo.startTime.getTime()) / 1000,
        );
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, taskInfo.startTime]);

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Get progress percentage
  const getProgress = () => {
    const totalSeconds = taskInfo.estimatedDuration * 60;
    return Math.min((elapsedTime / totalSeconds) * 100, 100);
  };

  // Get log icon and styling
  const getLogDisplay = (log: LogEntry) => {
    switch (log.type) {
      case "operator_transcript":
        return {
          icon: <User className="h-4 w-4 text-blue-400" />,
          bgColor: "bg-blue-900/20",
          borderColor: "border-blue-600/50",
          label: "Operator",
        };
      case "ai_agent_transcript":
        return {
          icon: <Bot className="h-4 w-4 text-green-400" />,
          bgColor: "bg-green-900/20",
          borderColor: "border-green-600/50",
          label: "AI Agent",
        };
      case "ai_agent_interpretation":
        return {
          icon: <Eye className="h-4 w-4 text-purple-400" />,
          bgColor: "bg-purple-900/20",
          borderColor: "border-purple-600/50",
          label: "AI Vision",
        };
    }
  };

  // Simulate adding new logs
  const addMockLog = () => {
    const mockLogs = [
      {
        type: "operator_transcript" as const,
        content: "Temperature reached 64°C, seeing more vapor production.",
      },
      {
        type: "ai_agent_transcript" as const,
        content:
          "Perfect. You should start seeing more consistent distillate flow. Monitor the head temperature.",
      },
      {
        type: "ai_agent_interpretation" as const,
        content:
          "Increased vapor in distillation column. Process efficiency improving.",
        confidence: 0.87,
      },
    ];

    const randomLog = mockLogs[Math.floor(Math.random() * mockLogs.length)];
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type: randomLog.type,
      content: randomLog.content,
      confidence: "confidence" in randomLog ? randomLog.confidence : undefined,
    };

    setLogs((prev) => [...prev, newLog]);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 p-5">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Camera className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-neutral-50">
              Laboratory Monitoring Dashboard
            </h1>
          </div>
          <p className="text-neutral-400 text-lg">
            Real-time monitoring and AI assistance for laboratory operations
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Left Column - Split into Live Feed and Logs */}
          <div className="space-y-6 h-full">
            {/* Live Feed - Upper Half */}
            <Card className="bg-neutral-900 border-neutral-800 h-1/2">
              <CardHeader>
                <CardTitle className="text-neutral-50 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-400" />
                  Live Feed
                  <Badge className="bg-red-600 text-white ml-auto">
                    ● LIVE
                  </Badge>
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  Real-time laboratory camera monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                <div className="relative h-full bg-neutral-800 rounded-lg overflow-hidden flex items-center justify-center">
                  {/* Stock image placeholder - In real implementation, this would be video feed */}
                  <div className="relative w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center">
                    <div className="text-center">
                      <FlaskConical className="h-24 w-24 text-neutral-400 mx-auto mb-4" />
                      <div className="bg-neutral-700 rounded-lg p-6 max-w-sm">
                        <h3 className="text-lg font-semibold text-neutral-200 mb-2">
                          Live Laboratory Feed
                        </h3>
                        <p className="text-neutral-400 text-sm">
                          Operator performing methanol distillation with proper
                          safety equipment. AI monitoring for safety compliance
                          and procedure verification.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Overlay indicators */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className="bg-green-600/80 text-white">
                      Safety: ✓
                    </Badge>
                    <Badge className="bg-blue-600/80 text-white">
                      Procedure: Active
                    </Badge>
                  </div>

                  <div className="absolute bottom-4 right-4">
                    <Badge className="bg-neutral-700/80 text-neutral-200">
                      HD • 1080p
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logs - Lower Half */}
            <Card className="bg-neutral-900 border-neutral-800 h-1/2">
              <CardHeader>
                <CardTitle className="text-neutral-50">Activity Logs</CardTitle>
                <CardDescription className="text-neutral-400">
                  Real-time transcription and AI analysis
                </CardDescription>
                <Button
                  onClick={addMockLog}
                  size="sm"
                  className="w-fit bg-blue-600 hover:bg-blue-700"
                >
                  Simulate New Log
                </Button>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {logs.map((log) => {
                      const display = getLogDisplay(log);
                      return (
                        <div
                          key={log.id}
                          className={`p-3 rounded-lg border ${display.bgColor} ${display.borderColor}`}
                        >
                          <div className="flex items-start gap-3">
                            {display.icon}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-neutral-200">
                                  {display.label}
                                </span>
                                <span className="text-xs text-neutral-400">
                                  {log.timestamp.toLocaleTimeString()}
                                </span>
                                {log.confidence && (
                                  <Badge
                                    variant="outline"
                                    className="bg-neutral-800 text-neutral-200"
                                  >
                                    {Math.round(log.confidence * 100)}%
                                    confidence
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-neutral-300">
                                {log.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Task Information */}
          <div className="h-full">
            <Card className="bg-neutral-900 border-neutral-800 h-full">
              <CardHeader>
                <CardTitle className="text-neutral-50 flex items-center gap-2">
                  <FlaskConical className="h-5 w-5 text-orange-400" />
                  Task Information
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  Current laboratory task details and progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Task Overview */}
                <div>
                  <h3 className="text-lg font-semibold text-neutral-200 mb-2">
                    {taskInfo.taskName}
                  </h3>
                  <Badge
                    className={
                      taskInfo.status === "in_progress"
                        ? "bg-blue-600"
                        : taskInfo.status === "completed"
                          ? "bg-green-600"
                          : taskInfo.status === "paused"
                            ? "bg-yellow-600"
                            : "bg-neutral-600"
                    }
                  >
                    {taskInfo.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>

                {/* Timer */}
                <div className="bg-neutral-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-neutral-300">Elapsed Time</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsRunning(!isRunning)}
                        className="border-neutral-600 text-neutral-300"
                      >
                        {isRunning ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setElapsedTime(0)}
                        className="border-neutral-600 text-neutral-300"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-2xl font-mono text-neutral-50 mb-2">
                    {formatTime(elapsedTime)}
                  </div>
                  <div className="w-full bg-neutral-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${getProgress()}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-400 mt-1">
                    <span>0:00:00</span>
                    <span>{formatTime(taskInfo.estimatedDuration * 60)}</span>
                  </div>
                </div>

                {/* Chemicals */}
                <div>
                  <h4 className="text-neutral-200 font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-400" />
                    Chemicals in Use
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {taskInfo.chemicals.map((chemical, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-orange-900/20 text-orange-300 border-orange-600/50"
                      >
                        {chemical}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Procedures */}
                <div>
                  <h4 className="text-neutral-200 font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    Active Procedures
                  </h4>
                  <div className="space-y-2">
                    {taskInfo.procedures.map((procedure, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-neutral-300">{procedure}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Safety Controls */}
                <div>
                  <h4 className="text-neutral-200 font-medium mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    Safety Controls
                  </h4>
                  <div className="space-y-2">
                    {taskInfo.safetyControls.map((control, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-neutral-300">{control}</span>
                        <Badge className="bg-green-600/20 text-green-300 text-xs ml-auto">
                          Active
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabMonitoringDashboard;
