import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div>
      <section className="container mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Get in Touch</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you. Whether you have a question about our properties, partnerships, or anything else, our team is ready to answer all your questions.
          </p>
        </div>
      </section>

      <section className="container mx-auto grid md:grid-cols-2 gap-12">
        <div>
            <h2 className="text-2xl font-headline font-bold mb-6">Contact Information</h2>
            <div className="space-y-6 text-muted-foreground">
                <div className="flex items-start gap-4">
                    <Mail className="h-6 w-6 text-primary mt-1"/>
                    <div>
                        <h3 className="font-semibold text-foreground">Email</h3>
                        <p>General Inquiries: <a href="mailto:hello@roomverse.com" className="text-primary hover:underline">hello@roomverse.com</a></p>
                        <p>Support: <a href="mailto:support@roomverse.com" className="text-primary hover:underline">support@roomverse.com</a></p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Phone className="h-6 w-6 text-primary mt-1"/>
                    <div>
                        <h3 className="font-semibold text-foreground">Phone</h3>
                        <p>+91 123 456 7890</p>
                        <p className="text-sm">Mon-Fri, 9am-6pm IST</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-primary mt-1"/>
                    <div>
                        <h3 className="font-semibold text-foreground">Office Address</h3>
                        <p>123 Co-work Towers, Business Bay, Pune, India</p>
                    </div>
                </div>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Your Name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="your@email.com" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="Question about a property" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Your message..." rows={5} />
                    </div>
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Send Message</Button>
                </form>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}
