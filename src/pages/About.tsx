import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Users, Rocket, Target } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold mb-4">About OrbitCode</h1>
            <p className="text-xl text-muted-foreground">
              Turning Earth observation archives into clear, actionable planning signals
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-8 gradient-card border-border/50 shadow-elevated">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Rocket className="h-8 w-8 text-primary" />
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                ClimaTrack is built by OrbitCode for the NASA Space Apps Challenge. We believe that decades of
                Earth observation data should be accessible and actionable for everyone planning outdoor activities,
                agricultural operations, or any weather-dependent endeavor.
              </p>
            </Card>

            <Card className="p-8 gradient-card border-border/50 shadow-elevated">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Target className="h-8 w-8 text-primary" />
                What We Do
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  Instead of relying on short-term weather forecasts, ClimaTrack provides probability-based insights
                  drawn from years of historical climate data. This approach helps you understand not just what the
                  weather might be, but how likely various conditions are based on decades of observations.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-muted/20 p-4 rounded-lg border border-border/50">
                    <h3 className="font-semibold text-foreground mb-2">Data-Driven</h3>
                    <p className="text-sm">
                      We leverage NASA's comprehensive Earth observation datasets to provide scientifically-backed insights.
                    </p>
                  </div>
                  <div className="bg-muted/20 p-4 rounded-lg border border-border/50">
                    <h3 className="font-semibold text-foreground mb-2">User-Focused</h3>
                    <p className="text-sm">
                      Complex climate data is transformed into clear, actionable probabilities that anyone can understand.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 gradient-card border-border/50 shadow-elevated">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                The Team
              </h2>
              <div className="text-center">
                <div className="inline-block">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">OrbitCode Team</h3>
                  <p className="text-muted-foreground">Full-Stack Developers</p>
                </div>
                <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
                  We're a team of passionate developers and data scientists participating in the NASA Space Apps
                  Challenge, dedicated to making Earth observation data accessible and useful for everyday planning.
                </p>
              </div>
            </Card>

            <Card className="p-8 gradient-card border-border/50 shadow-glow text-center">
              <h2 className="text-2xl font-bold mb-4">Built for NASA Space Apps Challenge 2025</h2>
              <p className="text-muted-foreground">
                This project demonstrates the potential of NASA's Earth observation data for practical,
                everyday applications.
              </p>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
