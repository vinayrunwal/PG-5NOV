'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Star, MessageCircle, ThumbsUp } from 'lucide-react';
import { type Property } from '@/lib/types';
import { PlaceHolderImages as placeholderImages } from '@/lib/placeholder-images';
import { supabase } from '@/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';
import Link from 'next/link';

const StarRating = ({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) => {
  const starSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`text-amber-400 ${starSize} ${i < Math.floor(rating) ? 'fill-current' : ''}`}
        />
      ))}
    </div>
  );
};

export function PropertyReviews({ property }: { property: Property }) {
  // check user on-demand via Supabase
  const [localUser, setLocalUser] = useState<any | null>(null);
  // fetch current user on mount
  (async () => {
    const { data } = await supabase.auth.getUser();
    setLocalUser(data.user ?? null);
  })();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const averageRating = property.reviews.length > 0
    ? property.reviews.reduce((acc, review) => acc + review.rating, 0) / property.reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = property.reviews.filter(r => Math.floor(r.rating) === star).length;
    return {
      star,
      count,
      percentage: property.reviews.length > 0 ? (count / property.reviews.length) * 100 : 0,
    };
  });

  const handleReviewSubmit = async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user ?? null;
    if (!user) {
      toast({ title: 'Please log in', description: 'You must be logged in to leave a review.', variant: 'destructive' });
      return;
    }
    if (rating === 0) {
      toast({ title: 'Rating required', description: 'Please select a star rating.', variant: 'destructive' });
      return;
    }
    if (!comment.trim()) {
      toast({ title: 'Comment required', description: 'Please write a comment for your review.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    // In a real app, you would submit this to Firestore
    setTimeout(() => {
      toast({ title: 'Review Submitted!', description: 'Thank you for your feedback.' });
      setRating(0);
      setComment('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Reviews & Ratings</CardTitle>
        {property.reviews.length > 0 ? (
          <div className="flex items-center gap-2 pt-2">
            <StarRating rating={averageRating} />
            <span className="font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({property.reviews.length} reviews)</span>
          </div>
        ) : (
          <CardDescription>No reviews yet. Be the first to leave one!</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {property.reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              {ratingDistribution.map(item => (
                <div key={item.star} className="flex items-center gap-2 text-sm">
                  <span>{item.star} star</span>
                  <Progress value={item.percentage} className="w-full h-2" />
                  <span className="w-8 text-right text-muted-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-6" />

        <div className="space-y-6">
          {property.reviews.map(review => {
            const avatar = placeholderImages.find(p => p.id === review.avatarImageId);
            return (
              <div key={review.id} className="flex gap-4">
                <Avatar>
                  {avatar && <AvatarImage src={avatar.imageUrl} alt={review.author} />}
                  <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{review.author}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <p className="text-muted-foreground mt-2">{review.comment}</p>
                </div>
              </div>
            );
          })}
        </div>

        <Separator className="my-8" />

        <div>
          <h3 className="text-xl font-headline font-semibold mb-4">Leave a Review</h3>
          {localUser ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Your Rating</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <button key={i} onClick={() => setRating(i + 1)}>
                      <Star
                        className={`h-6 w-6 text-amber-400 transition-colors ${
                          i < rating ? 'fill-current' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                 <Textarea
                    placeholder="Share your experience..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={4}
                 />
              </div>
              <Button onClick={handleReviewSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">
              <Link href="/login" className="text-primary underline">Log in</Link> to leave a review.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
