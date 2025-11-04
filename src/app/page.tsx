import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PropertyCard } from '@/components/PropertyCard';
import { featuredProperties, testimonials, whyChooseUs } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle } from 'lucide-react';
import { PlaceHolderImages as placeholderImages } from '@/lib/placeholder-images';
import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { HeroSearch } from '@/components/HeroSearch';
import Link from 'next/link';

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === 'hero-1');

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
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
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex flex-col items-center gap-6 px-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-lg">
            Find Your Perfect Co-living Space
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Discover curated PGs, hostels, and shared flats with premium amenities.
          </p>
          <HeroSearch />
        </div>
      </section>

      <section id="featured-properties" className="container mx-auto">
        <AnimateOnScroll>
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
            Featured Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property, index) => (
              <AnimateOnScroll key={property.id} delay={index * 0.1}>
                <PropertyCard property={property} />
              </AnimateOnScroll>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button
              size="lg"
              asChild
            >
              <Link href="/properties">View All Properties</Link>
            </Button>
          </div>
        </AnimateOnScroll>
      </section>

      <section id="how-it-works" className="bg-muted/40">
        <div className="container mx-auto">
          <AnimateOnScroll>
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">How It Works</h2>
                <p className="text-muted-foreground mb-12">
                Finding your next home is as easy as 1, 2, 3.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center p-6">
                    <div className="text-5xl font-bold text-primary mb-2">1</div>
                <h3 className="text-xl font-headline font-semibold mb-2">Search & Discover</h3>
                <p className="text-muted-foreground">Browse thousands of verified properties with our advanced filters to find your perfect match.</p>
                </div>
                <div className="flex flex-col items-center p-6">
                    <div className="text-5xl font-bold text-primary mb-2">2</div>
                <h3 className="text-xl font-headline font-semibold mb-2">Book with Confidence</h3>
                <p className="text-muted-foreground">Schedule a visit, and book your room online through our secure and transparent platform.</p>
                </div>
                <div className="flex flex-col items-center p-6">
                    <div className="text-5xl font-bold text-primary mb-2">3</div>
                <h3 className="text-xl font-headline font-semibold mb-2">Live & Thrive</h3>
                <p className="text-muted-foreground">Move in and enjoy a hassle-free living experience with our dedicated support and community events.</p>
                </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <section id="why-choose-us" className="bg-card">
        <div className="container mx-auto">
          <AnimateOnScroll>
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              Why Choose RoomVerse?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
              {whyChooseUs.map((item, index) => (
                <AnimateOnScroll key={item.title} delay={index * 0.1}>
                  <div className="flex flex-col items-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-headline font-semibold mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      <section id="testimonials" className="container mx-auto">
        <AnimateOnScroll>
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
            What Our Tenants Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => {
              const testimonialImage = placeholderImages.find(
                p => p.id === testimonial.imageId
              );
              return (
                <AnimateOnScroll key={testimonial.name} delay={index * 0.1}>
                  <Card className="flex flex-col justify-between h-full">
                    <CardContent className="p-6">
                      <blockquote className="text-muted-foreground italic mb-4">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="flex items-center gap-4 mt-auto">
                        {testimonialImage && (
                          <Avatar>
                            <AvatarImage
                              src={testimonialImage.imageUrl}
                              alt={testimonial.name}
                              data-ai-hint={testimonialImage.imageHint}
                            />
                            <AvatarFallback>
                              {testimonial.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.location}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimateOnScroll>
              );
            })}
          </div>
        </AnimateOnScroll>
      </section>
    </div>
  );
}
