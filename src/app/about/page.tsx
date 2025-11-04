import Image from 'next/image';
import { PlaceHolderImages as placeholderImages } from '@/lib/placeholder-images';
import { CheckCircle } from 'lucide-react';

export default function AboutPage() {
  const heroImage = placeholderImages.find(p => p.id === 'about-us-hero');

  return (
    <div>
      <section className="relative h-[40vh] w-full flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 flex flex-col items-center gap-4 px-4">
          <h1 className="text-4xl md:text-5xl font-headline font-bold drop-shadow-lg">
            About RoomVerse
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Redefining co-living for the modern generation.
          </p>
        </div>
      </section>

      <section className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-headline font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              Our mission is to provide a seamless and trustworthy platform for finding and managing co-living spaces. We believe that finding a home should be an exciting journey, not a stressful task. RoomVerse connects tenants with high-quality, verified properties, and empowers landlords with the tools they need to succeed.
            </p>
            <p className="text-muted-foreground">
              We are committed to building vibrant communities where students and young professionals can thrive, connect, and feel at home.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-headline font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground">
              To become the most trusted and preferred co-living platform in the world, known for our commitment to quality, transparency, and community-building. We envision a future where everyone can easily find a comfortable, safe, and inspiring place to live.
            </p>
          </div>
        </div>
      </section>
      
      <section className="bg-card">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground mb-12">
              We've simplified the rental process to make it as easy as possible for both tenants and landlords.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6 border rounded-lg">
                <div className="text-5xl font-bold text-primary mb-2">1</div>
              <h3 className="text-xl font-headline font-semibold mb-2">Search & Discover</h3>
              <p className="text-muted-foreground">Browse thousands of verified properties with our advanced filters to find your perfect match.</p>
            </div>
             <div className="flex flex-col items-center p-6 border rounded-lg bg-primary/5">
                <div className="text-5xl font-bold text-primary mb-2">2</div>
              <h3 className="text-xl font-headline font-semibold mb-2">Book with Confidence</h3>
              <p className="text-muted-foreground">Schedule a visit, and book your room online through our secure and transparent platform.</p>
            </div>
             <div className="flex flex-col items-center p-6 border rounded-lg">
                <div className="text-5xl font-bold text-primary mb-2">3</div>
              <h3 className="text-xl font-headline font-semibold mb-2">Live & Thrive</h3>
              <p className="text-muted-foreground">Move in and enjoy a hassle-free living experience with our dedicated support and community events.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
