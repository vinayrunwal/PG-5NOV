
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Property } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages as placeholderImages } from '@/lib/placeholder-images';
import { MapPin, Heart } from 'lucide-react';
import { AmenityIcon } from './AmenityIcon';
import { supabase } from '@/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = placeholderImages.find(p => p.id === property.mainImageId);
  // check auth on demand via Supabase
  const { toast } = useToast();
  // This is a mock implementation. In a real app, you'd get this from a user's profile.
  const isFavorited = false; 

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: 'Please log in', description: 'You need to be logged in to save properties.', variant: 'destructive' });
      return;
    }
    // In a real app, you would call a function here to update the user's favorites in Firestore.
    toast({
      title: isFavorited ? 'Property Unfavorited' : 'Property Favorited!',
      description: `${property.title} has been ${isFavorited ? 'removed from' : 'added to'} your favorites.`,
    });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg duration-300 group">
      <Link href={`/properties/${property.id}`} prefetch={false}>
        <div className="relative h-56 w-full">
          {mainImage && (
            <Image
              src={mainImage.imageUrl}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={mainImage.imageHint}
            />
          )}
          <Badge className="absolute top-4 left-4" variant="secondary">{property.type}</Badge>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-9 w-9 rounded-full bg-background/70 text-rose-500 hover:bg-background"
            onClick={handleFavoriteClick}
            aria-label="Favorite this property"
          >
            <Heart className={isFavorited ? 'fill-current' : ''} />
          </Button>
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-headline font-semibold truncate">{property.title}</h3>
          <div className="flex items-center text-muted-foreground text-sm mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.location}</span>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-lg font-semibold">
              INR {property.priceRange.min.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
            <div className="flex gap-2">
              {property.amenities.slice(0, 3).map((amenity) => (
                <AmenityIcon key={amenity} name={amenity} className="h-5 w-5 text-muted-foreground" />
              ))}
            </div>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-black">
          <Link href={`/properties/${property.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
