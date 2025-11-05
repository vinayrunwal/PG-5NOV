
'use client';

import { properties } from "@/lib/data";
import { notFound, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages as placeholderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AmenityIcon } from "@/components/AmenityIcon";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Check, MapPin, X } from "lucide-react";
import Link from "next/link";
import { PropertyReviews } from "@/components/PropertyReviews";
import { useUser } from "@/firebase/auth/use-user";
import { useEffect, useState } from "react";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const id = params.id as string;
  const property = properties.find(p => p.id === id);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  if (isUserLoading || !user) {
    return <div>Loading...</div>;
  }

  if (!property) {
    notFound();
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Carousel className="w-full rounded-lg overflow-hidden border">
              <CarouselContent>
                {property.galleryImageIds.map((imageId, index) => {
                   const img = placeholderImages.find(p => p.id === imageId);
                   return img ? (
                     <CarouselItem key={index}>
                      <div className="relative aspect-[4/3]">
                         <Image
                           src={img.imageUrl}
                           alt={`${property.title} - image ${index + 1}`}
                           fill
                           className="object-cover"
                           data-ai-hint={img.imageHint}
                         />
                      </div>
                     </CarouselItem>
                   ) : null;
                })}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">About this property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                    Welcome to {property.title}, a premium {property.type.toLowerCase()} located in the heart of {property.location}. Designed for comfort and convenience, this property offers a vibrant community atmosphere perfect for students and young professionals. Enjoy top-notch amenities and a hassle-free living experience with everything you need right at your doorstep.
                </p>
              </CardContent>
            </Card>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Amenities</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.amenities.map(amenity => (
                        <div key={amenity} className="flex items-center gap-3">
                            <AmenityIcon name={amenity} className="h-6 w-6 text-primary" />
                            <span className="text-muted-foreground">{amenity}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
            
            <PropertyReviews property={property} />

          </div>
          <div className="lg:col-span-1">
             <Card className="sticky top-20">
                <CardHeader>
                    <h1 className="text-3xl font-headline font-bold">{property.title}</h1>
                    <div className="flex items-center text-muted-foreground text-sm mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{property.location}</span>
                    </div>
                     <Badge className="mt-2 w-fit" variant="secondary">{property.type}</Badge>
                </CardHeader>
                <CardContent>
                    <Separator className="my-4" />
                    <h3 className="font-headline text-xl mb-4">Room Options</h3>
                    <div className="space-y-4">
                        {property.rooms.map(room => (
                            <div key={room.id} onClick={() => setSelectedRoom(room)} className={`flex justify-between items-center p-3 rounded-md border cursor-pointer ${selectedRoom?.id === room.id ? 'ring-2 ring-primary' : ''}`}>
                                <div>
                                    <p className="font-semibold">{room.type}</p>
                                    <p className="text-sm">
                                        INR {room.price.toLocaleString()}
                                        <span className="text-muted-foreground">/mo</span>
                                    </p>
                                </div>
                                {room.isAvailable ? (
                                    <div className="flex items-center gap-1 text-green-600 text-sm">
                                        <Check className="h-4 w-4"/>
                                        <span>Available</span>
                                    </div>
                                ) : (
                                     <div className="flex items-center gap-1 text-red-600 text-sm">
                                        <X className="h-4 w-4"/>
                                        <span>Booked</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <Button asChild size="lg" className="w-full mt-6 bg-accent hover:bg-accent/90 text-black" disabled={!selectedRoom || !selectedRoom.isAvailable}>
                        <Link href={`/book/${property.id}?room=${selectedRoom?.id}`}>Book Now</Link>
                    </Button>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
