import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/hero-mindful.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
      {/* Background hero image */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl animate-fade-in">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light text-foreground mb-6 tracking-tight">
            Find peace.
            <br />
            Find yourself.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6 font-light leading-relaxed">
            Professional online therapy designed to help you 
            rediscover balance and happiness - on your terms.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="shadow-gentle border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-primary font-medium text-lg">
                Private & Secure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Your conversations are completely private and encrypted. We never store or share your personal information.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-gentle border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-primary font-medium text-lg">
                Personalized Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Our AI adapts to your communication style and preferences, providing support tailored just for you.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="shadow-gentle border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-primary font-medium text-lg">
                Always Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Get support whenever you need it, day or night. No appointments, no waiting - just immediate help.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate("/login")}
            className="bg-primary hover:bg-primary/90 transition-colors text-primary-foreground border-0 py-6 px-12 text-xl font-medium"
            size="lg"
          >
            Book A Session
          </Button>
          
          <p className="mt-8 text-sm text-muted-foreground">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-secondary text-foreground border border-border mr-2">
              Beta Version
            </span>
            Free during beta • No credit card required
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
