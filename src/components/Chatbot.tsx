
'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Bot, Loader2, MessageSquare, Send, User, X } from 'lucide-react';
import { handleFaqQuestion } from '@/app/actions';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'bot';
  text: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(prev => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    startTransition(async () => {
      const result = await handleFaqQuestion({ question: input, context: '' });
      let botMessage: Message;
      if (result.success) {
        botMessage = { role: 'bot', text: typeof result.answer === 'string' ? result.answer : String(result.answer ?? '') };
      } else {
        botMessage = { role: 'bot', text: "Sorry, I couldn't find an answer to that question. Please try rephrasing or contact our support team." };
      }
      setMessages(prev => [...prev, botMessage]);
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);


  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={toggleOpen} size="icon" className="w-16 h-16 rounded-full shadow-lg">
          {isOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
          <span className="sr-only">Toggle Chatbot</span>
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 z-50 w-full max-w-sm"
          >
            <Card className="flex flex-col h-[60vh] shadow-xl border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline flex items-center gap-2">
                    <Bot />
                    RoomVerse Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow p-0">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                    <div className="p-6 space-y-4">
                        <div className='flex items-start gap-3'>
                             <Avatar className="h-8 w-8 border">
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                            <div className="bg-muted p-3 rounded-lg max-w-xs">
                                <p className="text-sm">Hi! How can I help you with our properties or booking process today?</p>
                            </div>
                        </div>
                        {messages.map((message, index) => (
                        <div key={index} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                             {message.role === 'bot' && (
                                <Avatar className="h-8 w-8 border">
                                    <AvatarFallback><Bot /></AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn(
                                'p-3 rounded-lg max-w-xs',
                                message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            )}>
                                <p className="text-sm">{message.text}</p>
                            </div>
                            {message.role === 'user' && (
                                 <Avatar className="h-8 w-8 border">
                                    <AvatarFallback><User /></AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                        ))}
                        {isPending && (
                             <div className='flex items-start gap-3'>
                                 <Avatar className="h-8 w-8 border">
                                    <AvatarFallback><Bot /></AvatarFallback>
                                </Avatar>
                                <div className="bg-muted p-3 rounded-lg">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={isPending}
                  />
                  <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
