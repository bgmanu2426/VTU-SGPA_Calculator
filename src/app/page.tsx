'use client';
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, RefreshCw, Image } from "lucide-react";
import { useRouter } from "next/navigation";


import FileUploadZone from "@/components/upload/file-upload-zone";
import ExtractedDataPreview from "@/components/upload/extracted-data-preview";
import { extractMarksheetData, ExtractMarksheetDataOutput } from "@/ai/flows/extract-marksheet-data";
import { useToast } from "@/hooks/use-toast";
import * as pdfjs from 'pdfjs-dist';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractMarksheetDataOutput | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [extractionAttempts, setExtractionAttempts] = useState(0);
  const [processingStep, setProcessingStep] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setStep(2);
    setExtractionAttempts(0);
    setProcessingStep("");

    try {
      if (selectedFile.type === 'application/pdf') {
          const imageDataUrl = await convertPdfToImage(selectedFile);
          setPreview(imageDataUrl);
      } else {
          const reader = new FileReader();
          reader.onloadend = () => {
              setPreview(reader.result as string);
          };
          reader.readAsDataURL(selectedFile);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
          variant: 'destructive',
          title: 'File Processing Failed',
          description: 'Could not process the uploaded file. Please try again with a different file.',
      });
    }
  };

  const convertPdfToImage = async (file: File): Promise<string> => {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
        fileReader.onload = async (e) => {
            if (!e.target?.result) return reject(new Error("Failed to read file"));
            const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
            const pdf = await pdfjs.getDocument(typedarray).promise;
            const page = await pdf.getPage(1); // Use the first page
            
            const viewport = page.getViewport({ scale: 2.0 }); // Increase scale for better resolution
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (!context) return reject(new Error("Could not get canvas context"));

            await page.render({ canvasContext: context, viewport: viewport }).promise;

            resolve(canvas.toDataURL('image/png'));
        };
        fileReader.onerror = reject;
        fileReader.readAsArrayBuffer(file);
    });
  }


  const processMarksheet = async () => {
    if (!file || !preview) return;

    setIsProcessing(true);
    setError(null);
    setExtractionAttempts(prev => prev + 1);

    try {
      setProcessingStep("Analyzing marksheet content...");
      const result = await extractMarksheetData({ marksheetDataUri: preview });

      if (result) {
        // Validate the extracted data
        const data = result;
        let isValid = true;
        let validationErrors = [];

        if (!data.studentDetails.name || data.studentDetails.name.trim() === "") {
          validationErrors.push("Student name not found");
          isValid = false;
        }

        if (!data.studentDetails.usn || data.studentDetails.usn.trim() === "") {
          validationErrors.push("USN not found");
          isValid = false;
        }

        if (!data.subjectDetails || !Array.isArray(data.subjectDetails) || data.subjectDetails.length === 0) {
          validationErrors.push("No subjects found");
          isValid = false;
        }

        if (isValid) {
          // Clean and validate subjects data
          const cleanedSubjects = data.subjectDetails.map((subject, index) => ({
            ...subject
          }));

          setExtractedData({
            ...data,
            subjectDetails: cleanedSubjects,
          });
          setStep(3);
        } else {
          throw new Error(`Data validation failed: ${validationErrors.join(', ')}`);
        }
      } else {
        const errorDetail = "Unknown extraction error";
        throw new Error(`Extraction failed: ${errorDetail}`);
      }
    } catch (error: any) {
      console.error("Error processing marksheet:", error);
      
      let errorMessage = "Failed to extract data from the marksheet. ";
      
      if (file.type === 'application/pdf') {
        errorMessage += "PDF processing encountered an issue. ";
      }
      
      errorMessage += "Please try again or enter the details manually.";
      
      setError(errorMessage);
    }

    setIsProcessing(false);
    setProcessingStep("");
  };

  const handleDataConfirm = () => {
    sessionStorage.setItem('extractedData', JSON.stringify(extractedData));
    router.push("/calculator");
  };

  const handleManualEntry = () => {
    router.push("/calculator");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Upload Your Marksheet
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your VTU marksheet (PDF or Image). PDFs will be automatically converted to images for better analysis.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 font-medium text-sm sm:text-base">Upload</span>
            </div>
            <div className={`w-6 sm:w-12 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 font-medium text-sm sm:text-base">Process</span>
            </div>
            <div className={`w-6 sm:w-12 h-0.5 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2 font-medium text-sm sm:text-base">Review</span>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-3">
                <p className="text-sm">{error}</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  {extractionAttempts < 2 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={processMarksheet}
                      disabled={isProcessing}
                      className="bg-white hover:bg-gray-50 text-sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleManualEntry}
                    className="bg-white hover:bg-gray-50 text-sm"
                  >
                    Enter Manually Instead
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {step === 1 && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-lg md:text-xl">
                <UploadIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                Select Marksheet File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUploadZone onFileSelect={handleFileSelect} />
            </CardContent>
          </Card>
        )}

        {step === 2 && file && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-lg md:text-xl">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                Process Marksheet
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <p className="text-base font-medium text-gray-900 mb-2 break-all">
                  Selected File: {file.name}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  File size: {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  File type: {file.type === 'application/pdf' ? 'PDF Document (will be converted)' : 'Image'}
                </p>
                {processingStep && (
                  <div className="flex items-center justify-center gap-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm font-medium">{processingStep}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={processMarksheet}
                  disabled={isProcessing}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base w-full sm:w-auto"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing... (This may take 30-60 seconds)
                    </>
                  ) : (
                    <>
                      {file.type === 'application/pdf' ? <Image className="w-5 h-5 mr-2" /> : <FileText className="w-5 h-5 mr-2" />}
                      {file.type === 'application/pdf' ? 'Convert & Extract Data' : 'Extract Data'}
                    </>
                  )}
                </Button>
                
                <div className="text-center">
                  <Button 
                    variant="link" 
                    onClick={handleManualEntry}
                    className="text-gray-600 text-sm"
                  >
                    Skip extraction and enter manually
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && extractedData && (
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-lg md:text-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Review Extracted Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExtractedDataPreview 
                data={extractedData}
                onConfirm={handleDataConfirm}
                onEdit={() => setStep(1)}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
