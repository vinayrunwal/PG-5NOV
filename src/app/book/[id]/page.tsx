
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { properties } from "@/lib/data";
import { CreditCard, Landmark, Wallet } from "lucide-react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function BookingPage() {
    const params = useParams();
    const id = params.id as string;
    const property = properties.find(p => p.id === id);
    const searchParams = useSearchParams();
    const roomId = searchParams.get('room');

    const selectedRoom = useMemo(() => {
        return property?.rooms.find(r => r.id === roomId);
    }, [property, roomId]);

    if (!property) {
        notFound();
    }
    
    const availableRooms = property.rooms.filter(r => r.isAvailable);
    const securityDeposit = selectedRoom ? selectedRoom.price * 2 : 0;
    const totalPayable = selectedRoom ? selectedRoom.price + securityDeposit : 0;


    return (
        <div className="bg-muted/40">
            <div className="container mx-auto py-12 md:py-24">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold">Complete Your Booking</h1>
                    <p className="mt-4 text-lg text-muted-foreground">You're just a few steps away from your new home.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Tenant Information</CardTitle>
                                <CardDescription>Please fill in your details to proceed.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" placeholder="John Doe" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" type="email" placeholder="john.doe@example.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="room-type">Select Room Type</Label>
                                        <Select defaultValue={selectedRoom?.id}>
                                            <SelectTrigger id="room-type">
                                                <SelectValue placeholder="Choose an available room" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableRooms.map(room => (
                                                    <SelectItem key={room.id} value={room.id}>
                                                        {room.type} - INR {room.price.toLocaleString()}/mo
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-1">
                        <Card className="sticky top-20">
                            <CardHeader>
                                <CardTitle className="font-headline">Booking Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="font-semibold">{property.title}</div>
                                <div className="text-sm text-muted-foreground">{property.location}</div>
                                {selectedRoom && (
                                    <>
                                        <div className="flex justify-between items-center pt-4 border-t">
                                            <span>Monthly Rent</span>
                                            <span className="font-semibold">INR {selectedRoom.price.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Security Deposit</span>
                                            <span className="font-semibold">INR {securityDeposit.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-lg font-bold pt-4 border-t">
                                            <span>Total Payable Now</span>
                                            <span>INR {totalPayable.toLocaleString()}</span>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                            <CardFooter className="flex-col gap-4 items-stretch">
                               <p className="text-sm text-muted-foreground text-center">Select Payment Method</p>
                                <Button variant="outline"><CreditCard className="mr-2"/>Pay with Card / UPI</Button>
                                <Button variant="outline"><Landmark className="mr-2"/>Bank Transfer</Button>
                                <Button variant="outline"><Wallet className="mr-2"/>Pay at Property</Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
