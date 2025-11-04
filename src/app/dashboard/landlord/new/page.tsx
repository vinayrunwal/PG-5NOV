import { NewPropertyForm } from "@/components/dashboard/NewPropertyForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPropertyPage() {
  return (
    <div>
        <div className="mb-8">
            <h1 className="text-3xl font-headline font-bold">List a New Property</h1>
            <p className="text-muted-foreground">Fill in the details below to get your property listed on RoomVerse.</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Property Details</CardTitle>
                <CardDescription>
                    Provide as much detail as possible to attract the right tenants. Use our AI tool to help generate a compelling description!
                </CardDescription>
            </CardHeader>
            <NewPropertyForm />
        </Card>
    </div>
  );
}
