"use client";

import { Heading } from "@/components/heading";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { formSchema } from "./constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileCheck2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiCopy } from 'react-icons/fi';
import ClipLoader from "react-spinners/ClipLoader";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";


const categories = {
  Cloud: ['Cloud Architect', 'Cloud Engineer', 'Cloud Consultant', 'Cloud Developer', 'Cloud Security Specialist', 'Cloud Administrator'],
  DevOps: ['DevOps Engineer', 'Site Reliability Engineer (SRE)', 'Build and Release Engineer', 'Infrastructure Engineer', 'Automation Engineer', 'Platform Engineer'],
  Cybersecurity: ['Cybersecurity Analyst', 'Information Security Manager', 'Penetration Tester', 'Security Consultant', 'Security Architect', 'Security Engineer'],
  DataScience: ['Data Scientist', 'Data Analyst', 'Data Engineer', 'Machine Learning Engineer', 'AI Specialist', 'Business Intelligence Analyst'],
  SoftwareDevelopment: ['Front-End Developer', 'Back-End Developer', 'Full-Stack Developer', 'Software Engineer', 'Mobile App Developer', 'Game Developer'],
  ITSupport: ['IT Support Specialist', 'Help Desk Technician', 'IT Technician', 'Systems Support Specialist', 'Technical Support Engineer', 'Desktop Support Specialist'],
  Networking: ['Network Administrator', 'Network Engineer', 'Network Architect', 'Network Security Specialist', 'Wireless Network Engineer', 'Network Analyst'],
  Database: ['Database Administrator (DBA)', 'Database Developer', 'Data Warehouse Engineer', 'Data Architect', 'SQL Developer', 'Database Analyst'],
  ProjectManagement: ['IT Project Manager', 'Technical Project Manager', 'Scrum Master', 'Product Manager', 'Agile Coach', 'Program Manager'],
  QualityAssurance: ['QA Engineer', 'QA Analyst', 'Test Automation Engineer', 'Performance Tester', 'QA Manager', 'Software Tester'],
};

const ResumeBulletPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categories | ''>('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      role: "",
      yearsOfExperience: "",
      jobDescription: "",
      resume: "",
    },
  });

  const isLoading = form.formState.isSubmitting || loading;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
  
      const prompt = `
      You are a Career Coach specialized in helping individuals tailor their resumes to specific job roles and categories.
      Consider the following details:
  
      1. Category: ${values.category}
      2. Role: ${values.role}
      3. User's Current Resume: ${values.resume}
      4. Job Description: ${values.jobDescription}
      5. User's Years of Experience: ${values.yearsOfExperience} years
  
      Using this information, generate exactly 3 highly relevant, STAR-formatted bullet points that:
      - Clearly quantify the user's achievements.
      - Align closely with the job description.
      - Highlight the user's key skills and experience that make them a strong fit for the role ${values.role} in the ${values.category} category.
  
      Ensure each bullet point is impactful and tailored to the role ${values.role} in the ${values.category} category.
      `;
  
      const response = await axios.post("/api/resumebullet", {
        messages: [{ role: "user", content: prompt }],
      });
  
      const bulletPoints = response.data.content.split("\n").filter((point: string) => point.trim() !== "");
  
      console.log("Received response data:", bulletPoints); // Log the response data
      setMessages((current) => [...current, ...bulletPoints]);

    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      }
      else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
      router.refresh();
    }
  };  

  /*const renderMessageContent = (content: string): React.ReactNode => {
    return content.split("\n").map((line, index) => (
      <p key={index}>{line}</p>
    ));
  }; */

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <Heading
        title="Resume Bullet Points Generator"
        description="Generate bullet points for your resume"
        icon={FileCheck2}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
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
              name="category"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormLabel>Select Category</FormLabel>
                  <Select onValueChange={(value) => { 
                    setSelectedCategory(value as keyof typeof categories); 
                    field.onChange(value); 
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your specialization" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(categories).map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="role"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormLabel>Select IT Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the role you are applying for" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedCategory && categories[selectedCategory].map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        placeholder="How many years of experience do you have in this field?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="resume"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Paste your Resume's Experience section below</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`Systems Analyst (Company Name)
Melbourne, Victoria (2021-Present)
                          
• Implemented a streamlined backend workflow for the recruitment process, analysing business requirements from internal stakeholders to enhance the efficiency of application tracking
• Performed comprehensive data set analysis, uncovering discrepancies with datasets, and implemented corrective measures to enhance data accuracy significantly.
• Developed weekly job alerts for individual study areas through the implementation of a WordPress plugin which facilitated the aggregation of job postings specific to each study area.
• Collaborated with stakeholders to provide technology solutions, designing a user-friendly onboarding process...`}
                        {...field}
                        className="h-40 w-full" 
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
                    <FormLabel>Enter the 'Responsibilities/ Qualifications' section of the Job Description below</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={` Your role responsibilities will also be to:

  • Prepare and lead Requirement Gathering Workshops with key stakeholders for medium to high-complexity projects.
  • Create, own, and interpret Process Maps for medium to high-complexity projects.
  • Complete mandatory training and maintain certification level.
  • Participate in added value activities outside regular client work...`}
                        {...field}
                        className="h-40 w-full" 
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
          {messages.length > 0 && (
            <div className="flex flex-col gap-y-4">
              {messages.slice(-3).map((message, index) => (
                <div key={index} className="p-4 border rounded-md shadow-sm relative">
                  <button
                    className="absolute top-2 right-2 text-sm text-blue-500"
                    onClick={() => copyToClipboard(message)}
                  >
                    <FiCopy/>
                  </button>
                  <p>{message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBulletPage;
