
'use client';
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calculator, Upload, GraduationCap, Medal, Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  SidebarInset,
  useSidebar
} from "@/components/ui/sidebar";


const navigationItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Upload Marksheet",
    url: "/upload",
    icon: Upload,
  },
  {
    title: "SGPA Calculator",
    url: "/calculator",
    icon: Calculator,
  },
  {
    title: "CGPA Calculator",
    url: "/cgpa-calculator",
    icon: Medal,
  },
];

export function AppLayout({ children }: {children: React.ReactNode}) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
      <>
        <style>
          {`
            :root {
              --vtu-blue: #1e3a8a;
              --vtu-gold: #f59e0b;
              --vtu-light-blue: #dbeafe;
              --vtu-dark-blue: #1e40af;
            }
            
            @media (max-width: 768px) {
              .sidebar-grading-chart {
                display: none;
              }
            }
          `}
        </style>
        
        <Sidebar className="border-r border-gray-200 bg-white">
          <SidebarHeader className="border-b border-gray-100 p-4 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">VTU SGPA</h2>
                <p className="text-xs md:text-sm text-gray-500">Calculator & Analyzer</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3 md:p-4 flex flex-col justify-between">
            <div>
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Tools
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1 md:space-y-2">
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`rounded-lg transition-all duration-200 ${
                            pathname === item.url 
                              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={handleLinkClick}
                        >
                          <Link href={item.url} className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3">
                            <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="font-medium text-sm md:text-base">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <div className="bg-slate-50 mt-6 p-3 sidebar-grading-chart md:mt-8 md:p-4 from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hidden">
                <h3 className="font-semibold text-blue-900 mb-2 text-sm md:text-base">VTU Grading System</h3>
                <div className="space-y-1 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">90-100:</span>
                    <span className="font-medium text-blue-800">O (10)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">80-89:</span>
                    <span className="font-medium text-blue-800">A+ (9)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">70-79:</span>
                    <span className="font-medium text-blue-800">A (8)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">60-69:</span>
                    <span className="font-medium text-blue-800">B+ (7)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">55-59:</span>
                    <span className="font-medium text-blue-800">B (6)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">50-54:</span>
                    <span className="font-medium text-blue-800">C (5)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">40-49:</span>
                    <span className="font-medium text-blue-800">P (4)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">0-39:</span>
                    <span className="font-medium text-red-600">F (0)</span>
                  </div>
                </div>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <main className="flex-1 flex flex-col bg-gray-50">
                <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 md:hidden">
                    <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg" />
                        <h1 className="text-lg font-semibold text-gray-900">VTU SGPA Calculator</h1>
                    </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto flex flex-col">
                    <div className="flex-grow">
                    {children}
                    </div>
                    <footer className="text-center p-4 text-gray-500 text-sm">
                    Made by <a href="https://lnbg.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">@bgmanu</a>
                    </footer>
                </div>
            </main>
        </SidebarInset>
    </>
  );
}
