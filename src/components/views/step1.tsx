import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  X,
  Plus,
  FlaskConical,
  Shield,
  Users,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface LabConfiguration {
  taskName: string;
  chemicals: string[];
  procedures: string[];
  safetyControls: string[];
  exposure: {
    peopleCount: number;
    duration: string;
    durationUnit: "minutes" | "hours" | "days";
  };
  additionalNotes?: string;
}

const LabConfigurationForm: React.FC = () => {
  const [config, setConfig] = useState<LabConfiguration>({
    taskName: "",
    chemicals: [],
    procedures: [],
    safetyControls: [],
    exposure: {
      peopleCount: 1,
      duration: "",
      durationUnit: "hours",
    },
    additionalNotes: "",
  });

  const [inputValues, setInputValues] = useState({
    chemical: "",
    procedure: "",
    safetyControl: "",
  });

  const [jsonOutput, setJsonOutput] = useState<string>("");

  const addItem = (
    field: "chemicals" | "procedures" | "safetyControls",
    value: string,
  ) => {
    if (value.trim() && !config[field].includes(value.trim())) {
      setConfig((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      setInputValues((prev) => ({
        ...prev,
        [field === "chemicals"
          ? "chemical"
          : field === "procedures"
            ? "procedure"
            : "safetyControl"]: "",
      }));
    }
  };

  const removeItem = (
    field: "chemicals" | "procedures" | "safetyControls",
    index: number,
  ) => {
    setConfig((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleKeyPress = (
    e: React.KeyboardEvent,
    field: "chemicals" | "procedures" | "safetyControls",
    value: string,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem(field, value);
    }
  };

  const generateJSON = () => {
    const schema = {
      taskConfiguration: {
        taskName: config.taskName,
        chemicals: config.chemicals,
        procedures: config.procedures,
        safetyControls: config.safetyControls,
        exposure: {
          personnelCount: config.exposure.peopleCount,
          estimatedDuration: `${config.exposure.duration} ${config.exposure.durationUnit}`,
          durationInMinutes: calculateDurationInMinutes(),
        },
        additionalContext: config.additionalNotes || null,
        timestamp: new Date().toISOString(),
        riskAssessmentRequired: true,
      },
    };

    setJsonOutput(JSON.stringify(schema, null, 2));
  };

  const calculateDurationInMinutes = (): number => {
    const duration = parseFloat(config.exposure.duration) || 0;
    switch (config.exposure.durationUnit) {
      case "minutes":
        return duration;
      case "hours":
        return duration * 60;
      case "days":
        return duration * 24 * 60;
      default:
        return 0;
    }
  };

  const isFormValid = () => {
    return (
      config.taskName.trim() !== "" &&
      config.chemicals.length > 0 &&
      config.procedures.length > 0 &&
      config.exposure.duration !== ""
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 p-5">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FlaskConical className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-neutral-50">
              Laboratory Copilot Configuration
            </h1>
          </div>
          <p className="text-neutral-400 text-lg">
            Configure your laboratory task for AI-assisted safety verification
          </p>
        </div>

        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3 space-y-6">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-neutral-50">
                  Task Information
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  Provide basic information about the laboratory task
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="taskName" className="text-neutral-200">
                    Task Name
                  </Label>
                  <Input
                    id="taskName"
                    placeholder="e.g., Organic Synthesis - Methanol Distillation"
                    value={config.taskName}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        taskName: e.target.value,
                      }))
                    }
                    className="bg-neutral-800 border-neutral-700 text-neutral-50 placeholder:text-neutral-500"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-neutral-50 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                  Chemicals
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  List all chemicals that will be used in this procedure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Methanol, Benzene, Acetone..."
                    value={inputValues.chemical}
                    onChange={(e) =>
                      setInputValues((prev) => ({
                        ...prev,
                        chemical: e.target.value,
                      }))
                    }
                    onKeyPress={(e) =>
                      handleKeyPress(e, "chemicals", inputValues.chemical)
                    }
                    className="bg-neutral-800 border-neutral-700 text-neutral-50 placeholder:text-neutral-500"
                  />
                  <Button
                    onClick={() => addItem("chemicals", inputValues.chemical)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.chemicals.map((chemical, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                    >
                      {chemical}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer hover:text-red-400"
                        onClick={() => removeItem("chemicals", index)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-neutral-50">Procedures</CardTitle>
                <CardDescription className="text-neutral-400">
                  Specify the procedures and techniques to be performed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Distillation, Extraction, Crystallization..."
                    value={inputValues.procedure}
                    onChange={(e) =>
                      setInputValues((prev) => ({
                        ...prev,
                        procedure: e.target.value,
                      }))
                    }
                    onKeyPress={(e) =>
                      handleKeyPress(e, "procedures", inputValues.procedure)
                    }
                    className="bg-neutral-800 border-neutral-700 text-neutral-50 placeholder:text-neutral-500"
                  />
                  <Button
                    onClick={() => addItem("procedures", inputValues.procedure)}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.procedures.map((procedure, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                    >
                      {procedure}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer hover:text-red-400"
                        onClick={() => removeItem("procedures", index)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-neutral-50 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  Safety Controls
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  List safety measures and controls in place
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Fume hood, Gas masks, Fire extinguisher..."
                    value={inputValues.safetyControl}
                    onChange={(e) =>
                      setInputValues((prev) => ({
                        ...prev,
                        safetyControl: e.target.value,
                      }))
                    }
                    onKeyPress={(e) =>
                      handleKeyPress(
                        e,
                        "safetyControls",
                        inputValues.safetyControl,
                      )
                    }
                    className="bg-neutral-800 border-neutral-700 text-neutral-50 placeholder:text-neutral-500"
                  />
                  <Button
                    onClick={() =>
                      addItem("safetyControls", inputValues.safetyControl)
                    }
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {config.safetyControls.map((control, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                    >
                      {control}
                      <X
                        className="h-3 w-3 ml-1 cursor-pointer hover:text-red-400"
                        onClick={() => removeItem("safetyControls", index)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-neutral-50 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  <Clock className="h-5 w-5 text-purple-400" />
                  Exposure
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  Personnel count and estimated duration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="peopleCount" className="text-neutral-200">
                      Number of People
                    </Label>
                    <Input
                      id="peopleCount"
                      type="number"
                      min="1"
                      value={config.exposure.peopleCount}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          exposure: {
                            ...prev.exposure,
                            peopleCount: parseInt(e.target.value) || 1,
                          },
                        }))
                      }
                      className="bg-neutral-800 border-neutral-700 text-neutral-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration" className="text-neutral-200">
                      Duration
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="duration"
                        type="number"
                        step="0.5"
                        placeholder="2.5"
                        value={config.exposure.duration}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            exposure: {
                              ...prev.exposure,
                              duration: e.target.value,
                            },
                          }))
                        }
                        className="bg-neutral-800 border-neutral-700 text-neutral-50 flex-1"
                      />
                      <select
                        value={config.exposure.durationUnit}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            exposure: {
                              ...prev.exposure,
                              durationUnit: e.target.value as
                                | "minutes"
                                | "hours"
                                | "days",
                            },
                          }))
                        }
                        className="bg-neutral-800 border border-neutral-700 text-neutral-50 px-3 py-2 rounded-md"
                      >
                        <option value="minutes">min</option>
                        <option value="hours">hrs</option>
                        <option value="days">days</option>
                      </select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-neutral-50">
                  Additional Notes
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  Any additional context or special considerations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., Working with high temperatures, special ventilation requirements, emergency procedures..."
                  value={config.additionalNotes}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      additionalNotes: e.target.value,
                    }))
                  }
                  className="bg-neutral-800 border-neutral-700 text-neutral-50 placeholder:text-neutral-500 min-h-[100px]"
                />
              </CardContent>
            </Card>
          </div>

          <div className="col-span-2 space-y-6">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-neutral-50">
                  Configuration Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Task Name</span>
                  <Badge
                    variant={config.taskName ? "default" : "secondary"}
                    className={
                      config.taskName ? "bg-green-600" : "bg-neutral-700"
                    }
                  >
                    {config.taskName ? "✓" : "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Chemicals</span>
                  <Badge
                    variant={
                      config.chemicals.length > 0 ? "default" : "secondary"
                    }
                    className={
                      config.chemicals.length > 0
                        ? "bg-green-600"
                        : "bg-neutral-700"
                    }
                  >
                    {config.chemicals.length > 0
                      ? `${config.chemicals.length} added`
                      : "None"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Procedures</span>
                  <Badge
                    variant={
                      config.procedures.length > 0 ? "default" : "secondary"
                    }
                    className={
                      config.procedures.length > 0
                        ? "bg-green-600"
                        : "bg-neutral-700"
                    }
                  >
                    {config.procedures.length > 0
                      ? `${config.procedures.length} added`
                      : "None"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Safety Controls</span>
                  <Badge
                    variant={
                      config.safetyControls.length > 0 ? "default" : "secondary"
                    }
                    className={
                      config.safetyControls.length > 0
                        ? "bg-green-600"
                        : "bg-yellow-600"
                    }
                  >
                    {config.safetyControls.length > 0
                      ? `${config.safetyControls.length} added`
                      : "Recommended"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Duration</span>
                  <Badge
                    variant={config.exposure.duration ? "default" : "secondary"}
                    className={
                      config.exposure.duration
                        ? "bg-green-600"
                        : "bg-neutral-700"
                    }
                  >
                    {config.exposure.duration
                      ? `${config.exposure.duration} ${config.exposure.durationUnit}`
                      : "Pending"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-neutral-50">
                  Generated Configuration
                </CardTitle>
                <CardDescription className="text-neutral-400">
                  JSON schema for LLM integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={generateJSON}
                  disabled={!isFormValid()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:text-neutral-500"
                >
                  Generate Configuration JSON
                </Button>

                {!isFormValid() && (
                  <Alert className="bg-yellow-900/20 border-yellow-600/50">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <AlertDescription className="text-yellow-300">
                      Please fill in task name, at least one chemical, one
                      procedure, and duration to generate configuration.
                    </AlertDescription>
                  </Alert>
                )}

                {jsonOutput && (
                  <div className="space-y-2">
                    <pre className="bg-neutral-950 border border-neutral-700 rounded-lg p-4 text-sm text-neutral-300 overflow-auto max-h-96">
                      {jsonOutput}
                    </pre>
                    <Button
                      onClick={() => navigator.clipboard.writeText(jsonOutput)}
                      variant="outline"
                      size="sm"
                      className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                    >
                      Copy JSON
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabConfigurationForm;
