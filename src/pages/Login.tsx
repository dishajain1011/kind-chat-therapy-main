import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import heroImage from "@/assets/hero-mindful.jpg";
import { supabase } from "@/lib/supabaseClient";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:9090/therapist";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) {
      setIsLoading(false);
      alert('Login failed: ' + error.message);
      return;
    }
    console.log("Login successful");
    // On success, Supabase will redirect, so no further action needed here
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const userObj = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.email
        };
        localStorage.setItem("user", JSON.stringify(userObj));

        // Call your backend to check if user profile exists
        try {
          const res = await fetch(`${BACKEND_BASE_URL}/api/user/${userObj.id}`);
          if (res.ok) {
            const userProfile = await res.json();
            if (userProfile && Object.keys(userProfile).length > 0) {
              // User exists, go to chat
              localStorage.setItem("userProfile", JSON.stringify(userProfile));
              navigate("/chat");
            } else {
              console.log("User does not exist, going to onboard");
              // User does not exist, go to onboard
              navigate("/onboard");
            }
          } else {
            console.log("API error, treating as not onboarded");
            // API error, treat as not onboarded
            navigate("/onboard");
          }
        } catch (err) {
          console.log("Network or other error, treating as not onboarded");
          console.log(err);
          // Network or other error, treat as not onboarded
          navigate("/onboard");
        }
      }
    };
    checkSession();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
      {/* Background hero image */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
              Professional online therapy designed to help you 
              rediscover balance and happiness - on your terms.
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
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
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
                <span className="text-primary font-medium">Your conversations are private and secure</span>
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