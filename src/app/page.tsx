
'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calculator, Upload, Users, FileText } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: <Upload className="w-8 h-8 text-blue-600" />,
    title: 'AI-Powered Marksheet Upload',
    description: 'Automatically extract subject details and marks by simply uploading an image or PDF of your marksheet. Our AI does the heavy lifting.',
    link: '/upload',
    cta: 'Upload Now',
  },
  {
    icon: <Calculator className="w-8 h-8 text-green-600" />,
    title: 'Instant SGPA Calculation',
    description: 'Once data is extracted or entered, get your accurate SGPA calculated in seconds. Verify auto-fetched credits and get your result.',
    link: '/calculator',
    cta: 'Calculate SGPA',
  },
  {
    icon: <Users className="w-8 h-8 text-purple-600" />,
    title: 'CGPA Calculator',
    description: 'Easily calculate your overall CGPA by entering the SGPA for each semester. We support standard and lateral entry schemes.',
    link: '/cgpa-calculator',
    cta: 'Calculate CGPA',
  },
  {
    icon: <FileText className="w-8 h-8 text-orange-600" />,
    title: 'Downloadable PDF Reports',
    description: 'Generate a professional and detailed PDF of your SGPA results, perfect for your records or for sharing.',
    link: '/calculator',
    cta: 'Get Your Report',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 font-headline">
            The Easiest Way to Calculate Your VTU SGPA & CGPA
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Tired of manual calculations? Just upload your marksheet, and let our AI-powered tool do the work for you. Fast, accurate, and free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              <Link href="/upload">
                Get Started <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="/cgpa-calculator">
                CGPA Calculator
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-headline">Core Features</h2>
            <p className="text-lg text-gray-600 mt-2">Everything you need for your academic calculations.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="flex-shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-full">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild variant="link" className="p-0 text-blue-600">
                    <Link href={feature.link}>
                      {feature.cta} <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
