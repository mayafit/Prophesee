import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { MapIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Prophesee
          </CardTitle>
          <CardDescription className="text-xl mt-2">
            Situational Awareness System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Access and visualize SAR imagery from NASA Capella on interactive maps for enhanced situational awareness.
          </p>
          <Link href="/map">
            <Button size="lg" className="w-full sm:w-auto">
              <MapIcon className="mr-2 h-5 w-5" />
              Launch Map View
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
