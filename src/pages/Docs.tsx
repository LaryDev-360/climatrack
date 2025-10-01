import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Database, Info, AlertTriangle, FileText, Settings } from "lucide-react";

const Docs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Documentation</h1>
            <p className="text-xl text-muted-foreground">
              Learn how ClimaTrack works and understand our data methodology
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-8 gradient-card border-border/50 shadow-elevated">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Database className="h-8 w-8 text-primary" />
                Data & Methodology
              </h2>
              <div className="prose prose-invert max-w-none space-y-4">
                <p className="text-muted-foreground">
                  ClimaTrack provides historical probabilities, not forecasts. We analyze decades of NASA Earth
                  observations to help you understand the likelihood of various weather conditions on any given day.
                </p>
              </div>
            </Card>

            <Card className="p-8 gradient-card border-border/50 shadow-elevated">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                Data Sources
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>NASA POWER:</strong> Solar radiation and meteorological parameters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>GPM/IMERG:</strong> Global precipitation measurements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>MERRA-2:</strong> Modern-Era Retrospective analysis for Research and Applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>GLDAS:</strong> Global Land Data Assimilation System</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 gradient-card border-border/50 shadow-elevated">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Info className="h-6 w-6 text-primary" />
                Method
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Our methodology involves extracting data from multiple years around your selected day of year,
                  computing statistical quantiles, and evaluating the probability of exceeding specific thresholds.
                </p>
                <div className="bg-muted/20 p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">Process Overview:</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Extract historical data for the selected location and day window</li>
                    <li>Calculate statistical distributions across multiple years</li>
                    <li>Compute probability of threshold exceedance</li>
                    <li>Present results with confidence intervals</li>
                  </ol>
                </div>
              </div>
            </Card>

            <Card className="p-8 gradient-card border-border/50 shadow-elevated">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Settings className="h-6 w-6 text-primary" />
                Thresholds
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Choose between two threshold modes to customize your analysis:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-muted/20 p-4 rounded-lg border border-border/50">
                    <h4 className="font-semibold text-foreground mb-2">Standard (Fixed)</h4>
                    <p className="text-sm">
                      Use absolute values like {">"} 32°C for hot conditions or {"<"} 10°C for cold conditions.
                      Best for specific planning requirements.
                    </p>
                  </div>
                  <div className="bg-muted/20 p-4 rounded-lg border border-border/50">
                    <h4 className="font-semibold text-foreground mb-2">Percentile (Relative)</h4>
                    <p className="text-sm">
                      Use local climate percentiles (e.g., 90th percentile for extreme heat).
                      Best for understanding relative conditions for that location.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8 gradient-card border-border/50 shadow-elevated bg-destructive/10">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                Limitations
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">⚠</span>
                  <span>
                    <strong>Not a forecast:</strong> ClimaTrack shows historical probabilities, not predictions of future weather.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">⚠</span>
                  <span>
                    <strong>Resolution dependent:</strong> Results depend on the spatial and temporal resolution of the underlying datasets.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">⚠</span>
                  <span>
                    <strong>Data latency:</strong> Most recent data may not be immediately available due to processing time.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">⚠</span>
                  <span>
                    <strong>Climate change:</strong> Historical patterns may not fully represent future climate conditions due to ongoing climate change.
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Docs;
