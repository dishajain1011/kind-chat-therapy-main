import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import heroImage from "@/assets/hero-mindful.jpg";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:9090/therapist";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Helper: decide whether to onboard or go straight to chat
  async function handleOnboardOrChat(user: {
    id: string;
    email: string;
    user_metadata?: any;
  }) {
    const userObj = {
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name || user.email!,
    };
    localStorage.setItem("user", JSON.stringify(userObj));

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/user/${userObj.id}`);
      if (res.ok) {
        const profile = await res.json();
        if (profile && Object.keys(profile).length > 0) {
          localStorage.setItem("userProfile", JSON.stringify(profile));
          navigate("/chat");
          return;
        }
      }
    } catch (e) {
      console.error("Error checking user profile:", e);
    }
    // Fallback: new user
    navigate("/onboard");
  }

  // Kick off Google OAuth
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {     
        redirectTo: `${window.location.origin}/login`    
      },
    });
    if (error) {
      setIsLoading(false);
      alert("Login failed: " + error.message);
    } else {
      // Actually redirect browser to the URL Supabase returned
      window.location.href = data.url!;
    }
  };

  // Listen for Supabase auth events and handle existing sessions
  useEffect(() => {
    // 1) On OAuth callback
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        handleOnboardOrChat(session.user);
      }
    });

    // 2) On mount, if there’s already a session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleOnboardOrChat(session.user);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
      {/* Background hero image */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Content */}
      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <Card className="shadow-therapeutic border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6">
            <CardTitle className="text-4xl font-light text-foreground">
              AI Therapist
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground leading-relaxed">
              Professional online therapy designed to help you rediscover balance and
              happiness—on your terms.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="text-center space-y-6">
              <p className="text-sm text-muted-foreground">
                Start your journey to better mental wellness
              </p>
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 transition-colors text-primary-foreground border-0 py-6 text-lg font-medium"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <LoadingSpinner size="sm" className="border-white/30 border-t-white" />
                    <span>Connecting…</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    {/* Google icon */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      {/* ...paths omitted for brevity */}
                    </svg>
                    <span>Continue with Google</span>
                  </div>
                )}
              </Button>
            </div>
            <div className="pt-6 border-t border-border">
              <p className="text-xs text-center text-muted-foreground leading-relaxed">
                By continuing, you agree to our Terms of Service and Privacy Policy.
                <br />
                <span className="text-primary font-medium">
                  Your conversations are private and secure
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
        {/* Beta badge */}
        <div className="mt-8 text-center">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-secondary text-foreground border border-border">
            Beta Version
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;