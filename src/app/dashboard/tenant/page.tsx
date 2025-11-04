
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Home, Wrench, FileText, Heart } from "lucide-react";
import { properties } from "@/lib/data";
import { PropertyCard } from "@/components/PropertyCard";

export default function TenantDashboardPage() {
  const favoriteProperties = properties.slice(1, 3); // Mock data

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8">Welcome, Tenant!</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Booking</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Modern Co-living in Downtown</div>
            <p className="text-xs text-muted-foreground">Koregaon Park, Pune</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline">View Details</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Payment Due</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">INR 12,000</div>
            <p className="text-xs text-muted-foreground">Due on August 1, 2024</p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Pay Now</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Agreement Progress</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold mb-2">75% Complete</div>
            <Progress value={75} aria-label="75% complete" />
          </CardContent>
          <CardFooter>
             <Button size="sm" variant="secondary">Continue</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><Heart className="text-rose-500"/>Favorite Properties</CardTitle>
            <CardDescription>Your saved properties for future reference.</CardDescription>
          </CardHeader>
          <CardContent>
            {favoriteProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">You haven't saved any properties yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Recent Maintenance Requests</CardTitle>
                <CardDescription>No recent requests.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button>Raise a new request</Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
