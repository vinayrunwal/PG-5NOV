'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlaceHolderImages as placeholderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const loginImage = placeholderImages.find(p => p.id === 'login-hero');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Supabase signIn error:', error);

        // Handle email-not-confirmed specially by attempting server-side confirm
        const msg = String(error.message || 'Invalid email or password.');
        if (msg.toLowerCase().includes('confirm') || msg.toLowerCase().includes('not confirmed') || msg.toLowerCase().includes('email')) {
          // First try a lightweight resend (may be a no-op if confirmations are disabled)
          try {
            await supabase.auth.resend({ type: 'signup', email });
          } catch (resErr) {
            console.debug('Resend confirmation failed (may be disabled):', resErr);
          }

          // Attempt server-side confirmation (requires SUPABASE_SERVICE_ROLE_KEY on the server)
          try {
            const resp = await fetch('/api/confirm-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email }),
            });

            const body = await resp.json();
            if (resp.ok && body?.user) {
              // Retry sign in once after marking confirmed
              const { data: retryData, error: retryErr } = await supabase.auth.signInWithPassword({ email, password });
              if (retryErr) {
                console.error('Retry signIn error after confirm:', retryErr);
                toast({ title: 'Login Failed', description: String(retryErr.message || retryErr), variant: 'destructive' });
                setIsLoading(false);
                return;
              }

              toast({ title: 'Signed in', description: 'Welcome back!' });
              router.push('/dashboard');
              setIsLoading(false);
              return;
            } else {
              console.warn('Confirm-user endpoint did not confirm user:', body);
              toast({ title: 'Email not confirmed', description: 'Please check your inbox for a confirmation link.', variant: 'destructive' });
            }
          } catch (confirmErr) {
            console.error('Confirm user error:', confirmErr);
            toast({ title: 'Login Failed', description: msg, variant: 'destructive' });
          }
        } else {
          toast({ title: 'Login Failed', description: msg, variant: 'destructive' });
        }

        setIsLoading(false);
        return;
      }

      // Successful sign in
      toast({ title: 'Signed in', description: 'Welcome back!' });
      // Redirect to dashboard or home
      router.push('/dashboard');
    } catch (err: any) {
        console.error('Login Error:', err);
        const msg = String(err?.message || 'Could not sign in.');

        // If the SDK threw an AuthApiError about confirmation, attempt the same
        // confirm-user flow as the handled error path: try resend, call server
        // confirm endpoint, then retry sign-in once.
        if (msg.toLowerCase().includes('confirm') || msg.toLowerCase().includes('not confirmed') || msg.toLowerCase().includes('email')) {
          try {
            try {
              await supabase.auth.resend({ type: 'signup', email });
            } catch (resErr) {
              console.debug('Resend confirmation failed (may be disabled):', resErr);
            }

            const resp = await fetch('/api/confirm-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email }),
            });

            const body = await resp.json();
            if (resp.ok && body?.user) {
              const { data: retryData, error: retryErr } = await supabase.auth.signInWithPassword({ email, password });
              if (retryErr) {
                console.error('Retry signIn error after confirm (catch):', retryErr);
                toast({ title: 'Login Failed', description: String(retryErr.message || retryErr), variant: 'destructive' });
              } else {
                toast({ title: 'Signed in', description: 'Welcome back!' });
                router.push('/dashboard');
              }
            } else {
              toast({ title: 'Email not confirmed', description: 'Please check your inbox for a confirmation link.', variant: 'destructive' });
            }
          } catch (confirmErr) {
            console.error('Confirm user error (catch):', confirmErr);
            toast({ title: 'Login Failed', description: msg, variant: 'destructive' });
          }
        } else {
          toast({ title: 'Login Failed', description: msg, variant: 'destructive' });
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex justify-center mb-4">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold font-headline">Welcome Back</h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to sign in.
            </p>
          </div>
          <form className="grid gap-4" onSubmit={handleLogin}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Login
            </Button>
            {/* Removed OTP login option - using email/password only */}
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {loginImage && (
            <Image
                src={loginImage.imageUrl}
                alt={loginImage.description}
                data-ai-hint={loginImage.imageHint}
                fill
                className="object-cover dark:brightness-[0.4]"
            />
        )}
      </div>
    </div>
  )
}
