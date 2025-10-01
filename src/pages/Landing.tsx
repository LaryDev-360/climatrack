import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Database, Gauge, TrendingUp, Download, Cloud, Wind, Droplets, ThermometerSun } from "lucide-react";
import heroImage from "@/assets/hero-earth.jpg";

const Landing = () => {
  const features = [
    {
      icon: Database,
      title: "Historical Insight",
      text: "Probabilities from multi-year climatology, not short-term forecasts.",
    },
    {
      icon: Gauge,
      title: "Custom Thresholds",
      text: "Use fixed thresholds (e.g. >32°C) or local percentiles.",
    },
    {
      icon: TrendingUp,
      title: "Visual & Actionable",
      text: "Gauges, bell curves, time-series, and clear summaries.",
    },
    {
      icon: Download,
      title: "Download & Cite",
      text: "Export CSV/JSON with units and data citations.",
    },
  ];

  const steps = [
    {
      number: "01",
      text: "Pick a location & day of year.",
    },
    {
      number: "02",
      text: "Choose variables & thresholds.",
    },
    {
      number: "03",
      text: "Get probabilities + download results.",
    },
  ];

  const stats = [
    { icon: Cloud, label: "NASA Data Sources", value: "4+" },
    { icon: Wind, label: "Weather Variables", value: "5+" },
    { icon: ThermometerSun, label: "Years of Data", value: "20+" },
    { icon: Droplets, label: "Global Coverage", value: "100%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-50" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
          }}
        />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Plan with probabilities,{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                not a crystal ball
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              ClimaTrack reveals the likelihood of very hot, cold, windy, humid, or uncomfortable conditions for any place and day of year — using decades of NASA Earth observations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button variant="hero" size="lg" className="w-full sm:w-auto">
                  Open the App
                </Button>
              </Link>
              <Link to="/docs">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Read the Docs
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 gradient-card border-border/50 shadow-elevated text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why ClimaTrack?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built on NASA's Earth observation archives for reliable, data-driven planning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 gradient-card border-border/50 shadow-elevated hover:shadow-glow transition-smooth"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How it works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to weather probability insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-8 gradient-card border-border/50 shadow-elevated h-full">
                  <div className="text-6xl font-bold text-primary/20 mb-4">{step.number}</div>
                  <p className="text-lg text-foreground">{step.text}</p>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="max-w-4xl mx-auto p-12 gradient-card border-border/50 shadow-glow text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Try ClimaTrack now — it's free for the Hackathon demo
            </h2>
            <Link to="/app">
              <Button variant="hero" size="lg">
                Open the App
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
