'use client';

import { useState } from 'react';
import { SgpaCalculator } from '@/components/sgpa-calculator';
import { ManualCalculator } from '@/components/manual-calculator';
import { Button } from '@/components/ui/button';
import { GraduationCap, Upload, Calculator } from 'lucide-react';

type View = 'upload' | 'calculator';

export default function Home() {
  const [view, setView] = useState<View>('upload');

  return (
    <div className="flex min-h-dvh bg-background font-body">
      <aside className="w-64 flex-col border-r bg-card p-4 hidden md:flex">
        <div className="flex items-center gap-3 p-2 mb-8">
          <GraduationCap className="h-10 w-10 text-primary" />
          <div>
            <h1 className="text-lg font-bold font-headline text-foreground">
              VTU SGPA
            </h1>
            <p className="text-xs text-muted-foreground">Calculator & Analyzer</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
            <p className='text-xs font-semibold text-muted-foreground px-2 my-1'>TOOLS</p>
            <Button
                variant={view === 'upload' ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => setView('upload')}
            >
                <Upload className="mr-2" />
                Upload Marksheet
            </Button>
            <Button
                variant={view === 'calculator' ? 'secondary' : 'ghost'}
                className="justify-start"
                onClick={() => setView('calculator')}
            >
                <Calculator className="mr-2" />
                Calculator
            </Button>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-2 md:hidden">
                <GraduationCap className="h-8 w-8 text-primary" />
                <h1 className="text-xl sm:text-2xl font-bold font-headline text-foreground">
                VTU SGPA
                </h1>
            </div>
            <div className="md:hidden">
              {/* Add mobile menu trigger here if needed */}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">
            <div className='max-w-4xl mx-auto'>
                {view === 'upload' && <SgpaCalculator />}
                {view === 'calculator' && <ManualCalculator />}
            </div>
        </main>
      </div>
    </div>
  );
}
