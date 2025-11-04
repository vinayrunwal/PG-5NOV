import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/data";
import { PlaceHolderImages as placeholderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  return (
    <div className="bg-background">
      <section className="container mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">The RoomVerse Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights on co-living, renting tips, and city guides for students and professionals.
          </p>
        </div>
      </section>

      <section className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => {
            const postImage = placeholderImages.find(p => p.id === post.imageId);
            return (
              <Card key={post.id} className="overflow-hidden transition-all hover:shadow-lg duration-300 group flex flex-col">
                {postImage && (
                  <div className="relative h-56 w-full">
                    <Image
                      src={postImage.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={postImage.imageHint}
                    />
                  </div>
                )}
                <CardHeader>
                  <h2 className="text-xl font-headline font-bold group-hover:text-primary transition-colors">
                    <Link href="#">{post.title}</Link>
                  </h2>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground mb-4">
                    By {post.author} on {post.date}
                  </p>
                  <p className="text-muted-foreground">{post.excerpt}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button variant="link" className="p-0 text-primary">Read More</Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
