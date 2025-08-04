'use client';

import { useState } from 'react';
import { FileImage, UploadCloud, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { extractMarksheetData } from '@/ai/flows/extract-marksheet-data';
import type { ExtractMarksheetDataOutput } from '@/ai/flows/extract-marksheet-data';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import * as pdfjs from 'pdfjs-dist';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


interface UploadFormProps {
  onDataExtracted: (data: ExtractMarksheetDataOutput) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

const Stepper = () => {
    return (
        <nav aria-label="Progress">
        <ol role="list" className="flex items-center justify-center space-x-8 sm:space-x-16">
            <li className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
                    <span className="text-sm font-medium">1</span>
                </div>
                <span className="ml-4 text-sm font-medium hidden sm:block">Upload</span>
            </li>
            <li className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300 text-gray-500">
                    <span className="text-sm font-medium">2</span>
                </div>
                <span className="ml-4 text-sm font-medium hidden sm:block">Process</span>
            </li>
            <li className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-300 text-gray-500">
                    <span className="text-sm font-medium">3</span>
                </div>
                <span className="ml-4 text-sm font-medium hidden sm:block">Review</span>
            </li>
        </ol>
        </nav>
    );
};

export function UploadForm({ onDataExtracted, setIsLoading, isLoading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!file || !preview) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload an image of your marksheet.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await extractMarksheetData({ marksheetDataUri: preview });
      onDataExtracted(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Extraction Failed',
        description: 'Could not extract data from the image. Please try another image.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Upload Your Marksheet</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
              Upload your VTU marksheet (PDF or Image). PDFs will be automatically converted to images for better analysis.
            </p>
        </div>
        <div className="flex justify-center">
            <Stepper />
        </div>
        <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
            <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5" />
                <CardTitle className="text-lg font-headline">Select Marksheet File</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg border-border hover:border-primary transition-colors">
                <div className='text-center text-muted-foreground'>
                    <FileImage className="w-12 h-12 mx-auto" />
                    <p className="mt-4 text-sm">
                        Drag and drop your marksheet here, or click to browse
                    </p>
                </div>
            <input
                type="file"
                accept="image/*,application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                disabled={isLoading}
            />
            </div>
            {preview && !isLoading && (
              <div className="relative p-2 border rounded-lg">
                <img src={preview} alt="Marksheet preview" className="w-full h-auto rounded-md" />
              </div>
            )}
             <div className='text-center text-muted-foreground text-xs'>
                JPG, PNG, PDF &nbsp;&bull;&nbsp; Max 10MB
            </div>

            <Button onClick={handleSubmit} disabled={isLoading || !file} className="w-full">
            {isLoading ? (
                <Loader2 className="animate-spin" />
            ) : (
                <>
                Process Marksheet
                </>
            )}
            </Button>
        </CardContent>
        </Card>
        <Alert className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <AlertTitle className="font-headline text-primary">Smart PDF Processing</AlertTitle>
            <AlertDescription className="text-muted-foreground text-xs space-y-1 mt-2">
                <li>PDF files are automatically converted to high-quality images for better text extraction accuracy.</li>
                <li>PDF pages converted to 2x resolution images.</li>
                <li>Enhanced OCR accuracy for marksheet data.</li>
                <li>Support for multi-page PDFs (first page is used).</li>
            </AlertDescription>
        </Alert>
    </div>
  );
}
