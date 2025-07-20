import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/ui/multi-select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ArrowLeft } from "lucide-react";

const traitOptions = [
  { value: "short-replies", label: "Prefers short replies" },
  { value: "no-emojis", label: "Hates emojis" },
  { value: "direct-advice", label: "Needs direct advice" },
  { value: "low-sarcasm", label: "Low sarcasm tolerance" },
  { value: "encouragement", label: "Loves encouragement" },
  { value: "practical", label: "Wants practical solutions" },
  { value: "empathetic", label: "Needs empathy first" },
  { value: "structured", label: "Prefers structured responses" },
];

const Onboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "Alex Johnson", // Pre-filled from mock Google account
    age: "",
    gender: "",
    genZMode: true,
    traits: [] as string[]
  });

  const isFormValid = formData.age && formData.gender && formData.traits.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    
    // Mock API call to /api/user/onboard
    setTimeout(() => {
      localStorage.setItem("userProfile", JSON.stringify(formData));
      setIsLoading(false);
      navigate("/chat");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/login")}
            className="border-border/50 hover:border-primary/50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Let's personalize your experience</h1>
            <p className="text-muted-foreground">Help us understand how to best support you</p>
          </div>
        </div>

        <Card className="shadow-therapeutic border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-medium text-foreground">
              Profile Setup
            </CardTitle>
            <CardDescription>
              This information helps our AI therapist communicate in a way that works best for you
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name - Read-only */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  readOnly
                  className="bg-muted/50 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">From your Google account</p>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  min="13"
                  max="100"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="transition-all focus:ring-primary/20"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger className="transition-all focus:ring-primary/20">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="nonbinary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Gen Z Mode */}
              <div className="flex items-center justify-between p-4 bg-card-secondary rounded-lg border border-border">
                <div>
                  <Label htmlFor="gen-z-mode" className="font-medium">Gen Z Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    More casual, relatable communication style
                  </p>
                </div>
                <Switch
                  id="gen-z-mode"
                  checked={formData.genZMode}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, genZMode: checked }))}
                />
              </div>

              {/* Traits */}
              <div className="space-y-2">
                <Label>Communication Preferences *</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Select up to 3 traits that describe how you prefer to communicate
                </p>
                <MultiSelect
                  options={traitOptions}
                  value={formData.traits}
                  onChange={(traits) => setFormData(prev => ({ ...prev, traits }))}
                  placeholder="Choose your communication style..."
                  maxSelections={3}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full bg-primary hover:bg-primary/90 transition-colors text-primary-foreground border-0 py-6 text-lg font-medium"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <LoadingSpinner size="sm" className="border-white/30 border-t-white" />
                    <span>Setting up your experience...</span>
                  </div>
                ) : (
                  <span>Continue to Chat</span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboard;