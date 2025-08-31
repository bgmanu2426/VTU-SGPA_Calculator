'use client';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Calculator, Upload, Users, FileText, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const features = [
	{
		icon: <Upload className="w-8 h-8 text-blue-600" />,
		title: 'AI-Powered Marksheet Upload',
		description:
			'Automatically extract subject details and marks by simply uploading an image or PDF of your marksheet. Our AI does the heavy lifting.',
		link: '/upload',
		cta: 'Upload Now',
	},
	{
		icon: <Calculator className="w-8 h-8 text-green-600" />,
		title: 'Instant SGPA Calculation',
		description:
			'Once data is extracted or entered, get your accurate SGPA calculated in seconds. Verify auto-fetched credits and get your result.',
		link: '/calculator',
		cta: 'Calculate SGPA',
	},
	{
		icon: <Users className="w-8 h-8 text-purple-600" />,
		title: 'CGPA Calculator',
		description:
			'Easily calculate your overall CGPA by entering the SGPA for each semester. We support standard and lateral entry schemes.',
		link: '/cgpa-calculator',
		cta: 'Calculate CGPA',
	},
	{
		icon: <FileText className="w-8 h-8 text-orange-600" />,
		title: 'Downloadable PDF Reports',
		description:
			'Generate a professional and detailed PDF of your SGPA results, perfect for your records or for sharing.',
		link: '/upload',
		cta: 'Get Your Report',
	},
];

export default function HomePage() {
	const router = useRouter();

	useEffect(() => {
		const isPWA = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
		if (isPWA) {
			router.push('/upload');
		}
	}, [router]);

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
				<div className="max-w-6xl mx-auto px-4">
					<div className="flex justify-between items-center h-16">
						<Link href="/" className="flex items-center gap-2">
							<GraduationCap className="w-7 h-7 text-blue-600" />
							<span className="font-bold text-lg text-gray-900">VTU SGPA Calculator</span>
						</Link>
						<nav className="hidden md:flex items-center gap-6">
							<Link
								href="/upload"
								className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
							>
								Upload
							</Link>
							<Link
								href="/calculator"
								className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
							>
								SGPA Calculator
							</Link>
							<Link
								href="/cgpa-calculator"
								className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
							>
								CGPA Calculator
							</Link>
							<Button asChild size="sm">
								<Link href="/upload">Get Started</Link>
							</Button>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative pt-32 pb-20 md:pt-48 md:pb-32 text-center px-4 overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 -z-10"></div>
				<div className="max-w-4xl mx-auto relative">
					<h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 font-headline animate-fade-in-down">
						<span className="bg-gradient-to-r from-blue-600 to-green-500 text-transparent bg-clip-text">
							VTU SGPA & CGPA Calculator
						</span>
					</h1>
					<p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up">
						Tired of manual calculations? Just upload your marksheet, and let our AI-powered tool do the work for you.
						Fast, accurate, and free.
					</p>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
						<Button
							asChild
							size="lg"
							className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
						>
							<Link href="/upload">
								Get Started <ArrowRight className="w-5 h-5 ml-2" />
							</Link>
						</Button>
						<Button
							asChild
							size="lg"
							variant="outline"
							className="w-full sm:w-auto bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow"
						>
							<Link href="/cgpa-calculator">CGPA Calculator</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-16 md:py-24 bg-gray-50 px-4">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-headline">Core Features</h2>
						<p className="text-lg text-gray-600 mt-2">
							Everything you need for your academic calculations.
						</p>
					</div>
					<div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
						{features.map((feature, index) => (
							<Card
								key={index}
								className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col bg-white"
							>
								<CardHeader className="flex-shrink-0">
									<div className="flex items-center gap-4">
										<div className="p-3 bg-gray-100 rounded-full">{feature.icon}</div>
										<CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
									</div>
								</CardHeader>
								<CardContent className="flex-grow">
									<p className="text-gray-600">{feature.description}</p>
								</CardContent>
								<div className="p-6 pt-0">
									<Button
										asChild
										variant="link"
										className="p-0 text-blue-600 font-semibold"
									>
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

			{/* Footer */}
			<footer className="bg-gray-900 text-white p-8 text-center">
				<div className="max-w-6xl mx-auto">
					<h3 className="text-2xl font-bold mb-2 font-headline">VTU SGPA Calculator</h3>
					<p className="text-gray-400 mb-4">
						Your reliable partner for academic calculations.
					</p>
					<div className="text-gray-400 text-sm">
						Made with ❤️ by{' '}
						<a
							href="https://lnbg.in/"
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-400 hover:underline font-semibold"
						>
							@bgmanu
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
