"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('tenant');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
      toast({ title: "Invalid Phone Number", description: "Please enter a valid phone number with a country code (e.g., +919876543210).", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      // Use Supabase Auth to create user
      const displayName = `${firstName} ${lastName}`.trim();

      // Create the user server-side as confirmed so they can log in immediately.
      const adminResp = await fetch('/api/admin-create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, display_name: displayName, phone: phoneNumber, role }),
      });

      const adminBody = await adminResp.json();
      if (!adminResp.ok) {
        console.error('Admin create user failed:', adminBody);
        toast({ title: 'Signup Failed', description: adminBody?.error || 'Could not create an account.', variant: 'destructive' });
        setIsLoading(false);
        return;
      }

      // If admin-created user, create profile row via server route
      const userId = adminBody?.user?.id || adminBody?.user?.user?.id || adminBody?.user?.id;
      if (userId) {
        try {
          await fetch('/api/create-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId, email, display_name: displayName }),
          });
        } catch (cpErr) {
          console.debug('create-profile failed:', cpErr);
        }
      }

      // Attempt to auto-confirm the user server-side (so login works immediately)
      try {
        await fetch('/api/confirm-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      } catch (confirmErr) {
        console.debug('Auto-confirm failed:', confirmErr);
      }

      // Attempt to sign the user in immediately
      try {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInError) {
          toast({ title: 'Signed in', description: 'Welcome!' });
          router.push('/dashboard');
          return;
        }
      } catch (siErr) {
        console.debug('Immediate sign-in failed:', siErr);
      }

      toast({ title: 'Account Created!', description: 'Please verify your email (if required) and log in.' });
      router.push('/login');
    } catch (err: any) {
      console.error('Signup Error:', err);
      toast({ title: 'Signup Failed', description: err?.message || 'Could not create an account.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 min-h-screen">
      <div className="mx-auto grid w-[400px] gap-6 bg-card p-8 rounded-lg shadow-lg border">
        <div className="grid gap-2 text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <h1 className="text-3xl font-bold font-headline">Create an Account</h1>
          <p className="text-balance text-muted-foreground">
            Join RoomVerse to find your next home or list your property.
          </p>
        </div>
        <form className="grid gap-4" onSubmit={handleSignup}>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" placeholder="Max" required value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="phone-number">Phone Number</Label>
            <Input
              id="phone-number"
              type="tel"
              placeholder="+91 98765 43210"
              required
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
           <div className="grid gap-2">
                <Label>I am a...</Label>
                <RadioGroup value={role} onValueChange={setRole} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tenant" id="r1" />
                        <Label htmlFor="r1">Tenant</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="landlord" id="r2" />
                        <Label htmlFor="r2">Landlord</Label>
                    </div>
                </RadioGroup>
            </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create an account"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}
