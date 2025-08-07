'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image, FileText, Zap } from "lucide-react";

export default function FileUploadZone({ onFileSelect }: {onFileSelect: (file: File) => void}) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        alert('Please select a PDF or image file (JPG, PNG)');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        alert('Please select a PDF or image file (JPG, PNG)');
      }
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 md:p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileInput}
          className="hidden"
          id="marksheet-upload"
        />
        
        <div className="space-y-3 md:space-y-4">
          <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
          </div>
          
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
              Upload Marksheet
            </h3>
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 px-2">
              Drag and drop your marksheet here, or click to browse
            </p>
            
            <label htmlFor="marksheet-upload">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 cursor-pointer w-full sm:w-auto">
                <span className="flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm md:text-base">Choose File</span>
                </span>
              </Button>
            </label>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Image className="w-3 h-3 md:w-4 md:h-4" />
              <span>JPG, PNG</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3 md:w-4 md:h-4" />
              <span>PDF</span>
            </div>
            <div>Max 10MB</div>
          </div>
        </div>
      </div>
    </div>
  );
}
