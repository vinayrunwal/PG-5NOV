'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useFirebase, useUser } from '@/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, signOut } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";
import { Loader2 } from 'lucide-react';

function PhoneLoginContent() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();
  const router = useRouter();
  const { auth } = useFirebase();
  const { user, isUserLoading } = useUser();
  const searchParams = useSearchParams();
  const isEmailLoginFlow = searchParams.get('emailLogin') === 'true';

  // Type assertion for the window object
  const windowWithRecaptcha = window as any;

  // Effect to set up reCAPTCHA on mount
  useEffect(() => {
    if (auth && !windowWithRecaptcha.recaptchaVerifier) {
      windowWithRecaptcha.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          console.log("reCAPTCHA verified");
        }
      });
    }
  }, [auth, windowWithRecaptcha]);
  
  // Effect to automatically send OTP if it's the email login flow
  useEffect(() => {
    if (isEmailLoginFlow && user && user.phoneNumber && !otpSent && !isLoading) {
      handleSendOtp(user.phoneNumber);
    }
  }, [isEmailLoginFlow, user, otpSent, isLoading]);

  // Effect for the resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendOtp = async (numberToUse?: string | null) => {
    const targetPhoneNumber = numberToUse || phoneNumber;
    if (!auth) {
        toast({ title: "Error", description: "Firebase is not initialized.", variant: "destructive" });
        return;
    }
    if (resendCooldown > 0 && !numberToUse) {
      toast({ title: "Please wait", description: `You can send another OTP in ${resendCooldown} seconds.` });
      return;
    }
    if (!/^\+[1-9]\d{1,14}$/.test(targetPhoneNumber)) {
      toast({ title: "Invalid Phone Number", description: "Please provide a valid phone number with a country code (e.g., +919876543210).", variant: "destructive" });
      if (isEmailLoginFlow) {
        // If the user from email login has no phone number, sign them out and redirect.
        signOut(auth);
        router.push('/signup');
      }
      return;
    }

    setIsLoading(true);
    try {
      const verifier = windowWithRecaptcha.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, targetPhoneNumber, verifier);
      setConfirmationResult(result);
      setOtpSent(true);
      if (!numberToUse) setResendCooldown(30);
      toast({ title: "OTP Sent!", description: "Please check your phone for the verification code." });
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({ title: "Failed to Send OTP", description: "Could not send OTP. Please check the phone number or try again.", variant: "destructive" });
       if (isEmailLoginFlow) {
        signOut(auth);
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
      toast({ title: "Error", description: "Please send an OTP first.", variant: "destructive" });
      return;
    }
    if (otp.length !== 6) {
       toast({ title: "Invalid OTP", description: "OTP must be 6 digits.", variant: "destructive" });
       return;
    }

    setIsLoading(true);
    try {
      await confirmationResult.confirm(otp);
      toast({ title: "Success!", description: "You have been successfully verified." });
      router.push('/properties'); // Redirect to booking options
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({ title: "Invalid OTP", description: "The OTP you entered is incorrect. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getPageTitle = () => {
    if(isEmailLoginFlow) return "Two-Factor Authentication";
    return "Phone Verification";
  }
  
  const getPageDescription = () => {
      if (isUserLoading && isEmailLoginFlow) return "Checking your account...";
      if(otpSent) return `Enter the OTP sent to ${isEmailLoginFlow ? user?.phoneNumber : phoneNumber}.`;
      if(isEmailLoginFlow) return "We need to verify your identity with a one-time password.";
      return "Enter your phone number to receive an OTP.";
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 py-12">
      <div id="recaptcha-container"></div>
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Logo />
            </div>
          <CardTitle className="text-2xl font-headline">{getPageTitle()}</CardTitle>
          <CardDescription>
            {getPageDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(!otpSent && !isEmailLoginFlow) && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button onClick={() => handleSendOtp()} className="w-full" disabled={isLoading || resendCooldown > 0}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Send OTP'}
              </Button>
            </div>
          )}
          
          {(otpSent || (isEmailLoginFlow && isUserLoading)) && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={isLoading || !otpSent}
                />
              </div>
              <Button onClick={handleVerifyOtp} className="w-full" disabled={isLoading || !otpSent}>
                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button variant="link" onClick={() => handleSendOtp(isEmailLoginFlow ? user?.phoneNumber : phoneNumber)} disabled={resendCooldown > 0 || isLoading}>
                 {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
              </Button>
            </div>
          )}

          {isEmailLoginFlow && !otpSent && (
            <div className="flex justify-center items-center h-24">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PhoneLoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PhoneLoginContent />
        </Suspense>
    );
}
