
'use client';

import React from "react";
import { useSearchParams } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";

import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, Loader2 } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { Property } from "@/lib/types";


// Static data for filter options, as Firestore won't be used for this.
const allAmenities = [ 'Wifi', 'AC', 'Power Backup', 'Housekeeping', 'Laundry', 'Meals', 'Common Kitchen', 'TV', 'Parking', 'Gym', 'Security', 'Fully Furnished' ];
const allCities = ['Pune', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Noida'];
const roomTypes = ['Private', 'Shared (2 beds)', 'Shared (3+ beds)'];

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const cityQuery = searchParams.get('city');

  const [city, setCity] = React.useState(cityQuery || 'all');
  const [priceRange, setPriceRange] = React.useState([5000, 50000]);
  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = React.useState<string[]>([]);

  const firestore = useFirestore();

  const propertiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    let q = collection(firestore, 'properties');
    
    // This is a simplified client-side filter for demonstration.
    // For production, some of this filtering should be done on the backend/query if possible.
    return q;
  }, [firestore]);

  const { data: properties, isLoading, error } = useCollection<Property>(propertiesQuery);
  
  const filteredProperties = React.useMemo(() => {
    if (!properties) return [];

    return properties.filter(p => {
      const cityMatch = !city || city === 'all' || p.city === city;
      const priceMatch = p.priceRange.min >= priceRange[0] && p.priceRange.min <= priceRange[1];
      const amenityMatch = selectedAmenities.length === 0 || selectedAmenities.every(a => p.amenities.includes(a));
      
      // Note: room type filtering is not implemented in this version as it requires querying subcollections,
      // which adds complexity. This can be added in a future step.

      return cityMatch && priceMatch && amenityMatch;
    });
  }, [properties, city, priceRange, selectedAmenities]);

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setSelectedAmenities(prev => 
      checked ? [...prev, amenity] : prev.filter(a => a !== amenity)
    );
  };
  
  const handleRoomTypeChange = (roomType: string, checked: boolean) => {
    setSelectedRoomTypes(prev => 
      checked ? [...prev, roomType] : prev.filter(rt => rt !== roomType)
    );
  };

  React.useEffect(() => {
    if (cityQuery) {
      setCity(cityQuery);
    }
  }, [cityQuery]);


  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Find Your Space</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse our curated collection of PGs, hostels, and shared flats.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>City</Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {allCities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Price Range (per month)</Label>
                <Slider 
                  value={priceRange} 
                  onValueChange={(value) => setPriceRange(value)} 
                  max={50000} 
                  min={5000} 
                  step={1000} 
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>INR {priceRange[0].toLocaleString()}</span>
                  <span>INR {priceRange[1].toLocaleString()}{priceRange[1] === 50000 ? '+' : ''}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="space-y-2">
                  {allAmenities.slice(0, 5).map(amenity => (
                     <div key={amenity} className="flex items-center space-x-2">
                       <Checkbox 
                         id={`amenity-${amenity}`} 
                         onCheckedChange={(checked) => handleAmenityChange(amenity, !!checked)}
                         checked={selectedAmenities.includes(amenity)}
                       />
                       <Label htmlFor={`amenity-${amenity}`} className="font-normal">{amenity}</Label>
                     </div>
                  ))}
                </div>
              </div>
              
               <div className="space-y-2">
                <Label>Room Type (Coming Soon)</Label>
                <div className="space-y-2">
                  {roomTypes.map(type => (
                     <div key={type} className="flex items-center space-x-2 opacity-50">
                       <Checkbox 
                         id={`room-${type}`} 
                         disabled
                       />
                       <Label htmlFor={`room-${type}`} className="font-normal">{type}</Label>
                     </div>
                  ))}
                </div>
              </div>

              <Button className="w-full" variant="outline" onClick={() => {
                setCity('all');
                setPriceRange([5000, 50000]);
                setSelectedAmenities([]);
                setSelectedRoomTypes([]);
              }}>Clear Filters</Button>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              Error loading properties. Please try again later.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredProperties.length > 0 ? (
                  filteredProperties.map(property => (
                      <PropertyCard key={property.id} property={property} />
                  ))
              ) : (
                  <div className="md:col-span-2 xl:col-span-3 text-center text-muted-foreground">
                      No properties match your current filters.
                  </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
