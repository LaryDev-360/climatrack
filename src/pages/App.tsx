import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Gauge, Download, MapPin, Calendar, Settings, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const AppPage = () => {
  const isMobile = useIsMobile();

  const SidebarContent = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          Select Parameters
        </h2>
        <p className="text-sm text-muted-foreground">
          Configure your climate analysis
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </Label>
          <Input
            id="location"
            placeholder="Lagos, Nigeria"
            defaultValue="Lagos, Nigeria"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="doy" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Day of Year
          </Label>
          <Input
            id="doy"
            type="date"
            defaultValue="2024-07-15"
          />
        </div>

        <div className="space-y-2">
          <Label>Variables</Label>
          <div className="space-y-2">
            {["Temperature", "Precipitation", "Wind", "Humidity", "Dust"].map((variable) => (
              <label key={variable} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  defaultChecked={variable === "Temperature" || variable === "Wind"}
                  className="rounded border-border"
                />
                <span className="text-sm">{variable}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Threshold Mode</Label>
          <Select defaultValue="standard">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="percentile">Percentile</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <Button className="w-full" variant="hero">
          Compute Probabilities
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      
      <div className="pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Desktop Sidebar */}
          {!isMobile && (
            <aside className="w-80 border-r border-border/50 bg-card/30 backdrop-blur-sm p-6 overflow-y-auto">
              <SidebarContent />
            </aside>
          )}

          {/* Mobile Sidebar Trigger */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-elevated"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
              {/* Location Map */}
              <Card className="p-6 gradient-card border-border/50 shadow-elevated">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location
                </h3>
                <div className="h-64 rounded-lg bg-muted/20 flex items-center justify-center border border-border/50">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Lagos, Nigeria</p>
                    <p className="text-sm text-muted-foreground">6.37°N, 2.39°E</p>
                  </div>
                </div>
              </Card>

              {/* Probabilities */}
              <Card className="p-4 md:p-6 gradient-card border-border/50 shadow-elevated">
                <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  Probabilities
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
                  {[
                    { label: "Very Hot", value: 62, color: "text-red-500" },
                    { label: "Very Cold", value: 4, color: "text-blue-500" },
                    { label: "Very Windy", value: 18, color: "text-cyan-500" },
                    { label: "Very Humid", value: 55, color: "text-green-500" },
                    { label: "Very Uncomfortable", value: 31, color: "text-yellow-500" },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className={`text-2xl md:text-4xl font-bold mb-1 md:mb-2 ${item.color}`}>
                        {item.value}%
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Distribution Chart */}
              <Card className="p-6 gradient-card border-border/50 shadow-elevated">
                <h3 className="text-xl font-semibold mb-4">Distribution (Bell Curve)</h3>
                <div className="h-64 rounded-lg bg-muted/20 flex items-center justify-center border border-border/50">
                  <p className="text-muted-foreground">Temperature distribution visualization</p>
                </div>
              </Card>

              {/* Time Series Chart */}
              <Card className="p-6 gradient-card border-border/50 shadow-elevated">
                <h3 className="text-xl font-semibold mb-4">Time Series</h3>
                <div className="h-64 rounded-lg bg-muted/20 flex items-center justify-center border border-border/50">
                  <p className="text-muted-foreground">Historical time series data</p>
                </div>
              </Card>

              {/* Summary */}
              <Card className="p-4 md:p-6 gradient-card border-border/50 shadow-elevated">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Summary</h3>
                <p className="text-sm md:text-lg">
                  On <span className="font-semibold text-primary">July 15</span> at{" "}
                  <span className="font-semibold text-primary">Lagos</span>, there is a{" "}
                  <span className="font-bold text-xl md:text-2xl text-red-500">62%</span> chance of very hot
                  conditions ({">"} 32°C).
                </p>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
