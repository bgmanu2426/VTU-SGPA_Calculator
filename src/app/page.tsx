import { SgpaCalculator } from '@/components/sgpa-calculator';
import { GraduationCap } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background font-body">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold font-headline text-foreground">
              SGPA Assistant
            </h1>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <SgpaCalculator />
      </main>
      <footer className="py-6 md:px-6 md:py-8 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          Built with ❤️ for VTU students.
        </div>
      </footer>
    </div>
  );
}
