'use client';

import { useState } from 'react';
import { FileImage, UploadCloud, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { extractMarksheetData } from '@/ai/flows/extract-marksheet-data';
import type { ExtractMarksheetDataOutput } from '@/ai/flows/extract-marksheet-data';
import { useToast } from '@/hooks/use-toast';

interface UploadFormProps {
  onDataExtracted: (data: ExtractMarksheetDataOutput) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

export function UploadForm({ onDataExtracted, setIsLoading, isLoading }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Upload Marksheet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg border-border hover:border-primary transition-colors">
          <UploadCloud className="w-12 h-12 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            Drag & drop your image here, or click to browse.
          </p>
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>
        {preview && (
          <div className="relative p-2 border rounded-lg">
            <img src={preview} alt="Marksheet preview" className="w-full h-auto rounded-md" />
          </div>
        )}
        <Button onClick={handleSubmit} disabled={isLoading || !file} className="w-full">
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <FileImage className="mr-2" /> Extract Data
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
