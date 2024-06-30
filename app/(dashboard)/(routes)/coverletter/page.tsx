"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import * as z from "zod";
import { FiCopy } from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Heading } from "@/components/heading";
import { Form, FormControl, FormItem, FormLabel, FormMessage, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/use-pro-modal";
import mammoth from 'mammoth';
import { Mails } from "lucide-react";
import { formSchema } from "./constants";
import { Textarea } from "@/components/ui/textarea";

const CoverLetterPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: null,
      jobDescription: "",
      hiringManager: "",
    },
  });

  const isLoading = form.formState.isSubmitting || loading;

  const readFileContent = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      let resumeContent = "";

      if (values.resume) {
        resumeContent = await readFileContent(values.resume);
      }

      const data = {
        jobDescription: values.jobDescription,
        hiringManager: values.hiringManager,
        resume: resumeContent,
        messages: [
            {
              role: "system",
              content: "You are a career coach specializing in writing professional, impactful cover letters."
            },
            {
              role: "user",
              content: `
                Write a cover letter based on the following details:
                1. Job Description: ${values.jobDescription}
                2. Hiring Manager: ${values.hiringManager || "N/A"}
                3. Resume: ${resumeContent}
              
                Follow this structure:
                YourName
                Address
                Details
    
                Date
    
                Hiring Manager
                Company Name
                Company Address (if known)
    
                [Cover letter content]
    
                Kind regards,
                YourName
    
                Ensure there is no additional text after "Kind regards, YourName". Avoid repeating content already mentioned in the resume and emphasize how the applicant can be a valuable addition to the company and align with the company's values. Do not make any information up. 
                `,
            }
          ]
      };

      const response = await axios.post("/api/resumebullet", data);

      setCoverLetter(response.data.content);

    } catch (error: any) {
      console.log("Error details:", error);
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <Heading
        title="Cover Letter Generator"
        description="Generate a professional cover letter"
        icon={Mails}
        iconColor="text-emerald-500"
        bgColor="bg-emerald-500/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="
                rounded-lg 
                w-full
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-5
              "
            >
              <FormField
                name="resume"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Upload Your Resume (Word Document only, max 2MB)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".doc,.docx"
                        disabled={isLoading}
                        onChange={(e) => {
                          field.onChange(e.target.files ? e.target.files[0] : null);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="jobDescription"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder="Paste the job description here"
                          {...field}
                          className="h-40 w-full"
                          maxLength={6500} // Adding maxLength attribute
                        />
                        <div className="absolute right-0 bottom-0 p-2 text-sm text-gray-500">
                          {field.value.length} / 6500
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="hiringManager"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Hiring Manager&apos;s Name (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        placeholder="Enter the hiring manager's name (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="col-span-12 lg:col-span-10" disabled={isLoading}>
                {isLoading ? <ClipLoader color={"#ffffff"} size={24} /> : "Generate"}
              </Button>              
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {coverLetter && (
            <div className="p-4 border rounded-md shadow-sm relative max-h-96 overflow-auto">
              <button
                className="absolute top-2 right-2 text-sm text-blue-500"
                onClick={() => copyToClipboard(coverLetter)}
              >
                <FiCopy />
              </button>
              <pre className="whitespace-pre-wrap">{coverLetter}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterPage;
