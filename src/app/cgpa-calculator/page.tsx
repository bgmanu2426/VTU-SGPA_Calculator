'use client';

import { CgpaCalculator } from "@/components/cgpa-calculator";
import { AppLayout } from "@/components/layout";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function CgpaCalculatorPage() {
    return (
        <SidebarProvider>
            <AppLayout>
                <div className="container mx-auto p-4 md:p-8">
                    <CgpaCalculator />
                </div>
            </AppLayout>
        </SidebarProvider>
    )
}
