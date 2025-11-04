'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Crosshair, MapPin, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function HeroSearch() {
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSearch = () => {
    if (location) {
      router.push(`/properties?city=${location}`);
    } else {
      router.push('/properties');
    }
  };

  const handleNearMeClick = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setIsLocating(false);
          toast({
            title: 'Location Found',
            description: "Searching for properties in Pune (as a demo).",
          });
          // For demo purposes, we'll redirect to Pune properties.
          // In a real app, you would use reverse geocoding to get the city from coords.
          router.push('/properties?city=Pune');
        },
        error => {
          console.error('Error getting location:', error);
          setIsLocating(false);
          toast({
            title: 'Location Error',
            description:
              'Could not get your location. Please ensure you have enabled location permissions for this site.',
            variant: 'destructive',
          });
        }
      );
    } else {
      setIsLocating(false);
      toast({
        title: 'Location Not Supported',
        description: 'Geolocation is not supported by your browser.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full max-w-3xl mt-4">
      <Card className="bg-background/80 backdrop-blur-sm border-white/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for PG in Pune, Mumbai, Delhi..."
                className="pl-10 h-12 text-foreground"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:bg-transparent"
                onClick={handleNearMeClick}
                disabled={isLocating}
                title="Find PGs near me"
              >
                <Crosshair className={isLocating ? 'animate-spin' : ''}/>
              </Button>
            </div>
            <Button size="lg" className="h-12" onClick={handleSearch}>
              <Search className="mr-2 h-5 w-5" /> Search
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
