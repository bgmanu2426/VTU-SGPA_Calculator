'use client';

import { CgpaCalculator } from "@/components/cgpa-calculator";
import { AppLayout } from "@/components/layout";

export default function CgpaCalculatorPage() {
    return (
        <AppLayout>
            <div className="container mx-auto p-4 md:p-8">
                <CgpaCalculator />
            </div>
        </AppLayout>
    )
}
