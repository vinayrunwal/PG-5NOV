import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-black text-primary-foreground">
      <div className="container grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="flex flex-col gap-4">
          <div>
            <Logo variant="dark" />
          </div>
          <p className="text-sm text-muted-foreground">
            Your seamless solution for co-living spaces. Find your community, find your home.
          </p>
          <div className="flex items-center space-x-2">
            <Input type="email" placeholder="Enter your email" className="max-w-xs flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400" />
            <Button type="submit" variant="secondary">Subscribe</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 md:col-span-2">
          <div>
            <h4 className="mb-4 font-headline font-semibold">Quick Links</h4>
            <nav className="grid gap-2 text-sm">
              <Link href="/properties" className="text-muted-foreground hover:text-white" prefetch={false}>
                Properties
              </Link>
              <Link href="/about" className="text-muted-foreground hover:text-white" prefetch={false}>
                About Us
              </Link>
              <Link href="/blog" className="text-muted-foreground hover:text-white" prefetch={false}>
                Blog
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-white" prefetch={false}>
                Contact
              </Link>
            </nav>
          </div>
          <div>
            <h4 className="mb-4 font-headline font-semibold">For Owners</h4>
            <nav className="grid gap-2 text-sm">
              <Link href="/dashboard/landlord" className="text-muted-foreground hover:text-white" prefetch={false}>
                List your Property
              </Link>
              <Link href="/dashboard/landlord" className="text-muted-foreground hover:text-white" prefetch={false}>
                Owner Dashboard
              </Link>
               <Link href="/faq" className="text-muted-foreground hover:text-white" prefetch={false}>
                FAQs
              </Link>
            </nav>
          </div>
        </div>
        <div>
          <h4 className="mb-4 font-headline font-semibold">Follow Us</h4>
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-white" prefetch={false}>
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-white" prefetch={false}>
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-white" prefetch={false}>
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 text-sm text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} RoomVerse. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white" prefetch={false}>
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white" prefetch={false}>
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
