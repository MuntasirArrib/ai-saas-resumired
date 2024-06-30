"use client";

import React, { useState } from "react";
import { Heading } from "@/components/heading";
import { Check, ChevronsUpDown, UserSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { formSchema } from "./constants";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { FiCopy } from 'react-icons/fi';
import ClipLoader from "react-spinners/ClipLoader";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";
import { FieldValues, ControllerRenderProps } from "react-hook-form";


const categories = {
  Cloud: ['Cloud Architect', 'Cloud Engineer', 'Cloud Consultant', 'Cloud Developer', 'Cloud Security Specialist', 'Cloud Administrator'],
  DevOps: ['DevOps Engineer', 'Site Reliability Engineer (SRE)', 'Build and Release Engineer', 'Infrastructure Engineer', 'Automation Engineer', 'Platform Engineer'],
  Cybersecurity: ['Cybersecurity Analyst', 'Information Security Manager', 'Penetration Tester', 'Security Consultant', 'Security Architect', 'Security Engineer'],
  DataScience: ['Data Scientist', 'Data Analyst', 'Data Engineer', 'Machine Learning Engineer', 'AI Specialist', 'Business Intelligence Analyst'],
  SoftwareDevelopment: ['Front-End Developer', 'Back-End Developer', 'Full-Stack Developer', 'Software Developer','Software Engineer', 'Mobile App Developer', 'Game Developer'],
  ITSupport: ['IT Support Specialist', 'Help Desk Technician', 'IT Technician', 'Systems Support Specialist', 'Technical Support Engineer', 'Desktop Support Specialist', 'Systems Analyst', 'Business Analyst'],
  Networking: ['Network Administrator', 'Network Engineer', 'Network Architect', 'Network Security Specialist', 'Wireless Network Engineer', 'Network Analyst'],
  Database: ['Database Administrator (DBA)', 'Database Developer', 'Data Warehouse Engineer', 'Data Architect', 'SQL Developer', 'Database Analyst'],
  ProjectManagement: ['IT Project Manager', 'Technical Project Manager', 'Scrum Master', 'Product Manager', 'Agile Coach', 'Program Manager'],
  QualityAssurance: ['QA Engineer', 'QA Analyst', 'Test Automation Engineer', 'Performance Tester', 'QA Manager', 'Software Tester'],
};

const jobTitles = Object.values(categories).flat().sort();

interface ComboboxProps {
  field: ControllerRenderProps<any, any>;
}

const Combobox: React.FC<ComboboxProps> = ({ field }) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {field.value || "Select job title..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-full">
        <Command>
          <CommandInput placeholder="Search job title..." />
          <CommandList>
            <CommandEmpty>No job title found.</CommandEmpty>
            <CommandGroup>
              {jobTitles.map((jobTitle) => (
                <CommandItem
                  key={jobTitle}
                  value={jobTitle}
                  onSelect={(currentValue) => {
                    field.onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      field.value === jobTitle ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {jobTitle}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const ResumeSummaryPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentJobTitle: "",
      applyingJobTitle: "",
      companyName: "",
      jobDescription: "",
      yearsOfExperience: "",
      certifications: "",
      skills: "",
    },
  });

  const isLoading = form.formState.isSubmitting || loading;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
  
      const prompt = `
        Create a professional profile summary for an individual with the following details. Avoid using first-person sentences:

        1. Current Job Title: ${values.currentJobTitle}
        2. Applying Job Title: ${values.applyingJobTitle}
        3. Company Name: ${values.companyName}
        4. Job Description: ${values.jobDescription}
        5. Years of Experience: ${values.yearsOfExperience} years
        ${values.certifications ? `6. Certifications: ${values.certifications}` : ""}
        ${values.skills ? `7. Skills: ${values.skills}` : ""}

        The profile summary should be engaging and highlight the individual's key qualifications, experience, and achievements. Demonstrate how these attributes will benefit ${values.companyName}. Emphasize the alignment of the individual's current job, skills, and certifications with the company's needs and the applying job title. The summary should be no more than 5 sentences long.
      `;

      const response = await axios.post("/api/resumesummary", {
        messages: [{ role: "user", content: prompt }],
      });
  
      const summaries = response.data.content.split("\n\n").filter((summary: string) => summary.trim() !== "");
  
      console.log("Received response data:", summaries); // Log the response data
      setMessages(summaries.slice(0, 3));

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <Heading
        title="Resume Profile Summary Generator"
        description="Generate a professional summary for your resume"
        icon={UserSearch}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
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
                name="currentJobTitle"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Current Job Title</FormLabel>
                    <Combobox field={field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="applyingJobTitle"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Target Job Title</FormLabel>
                    <Combobox field={field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="companyName"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Target Company Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        placeholder="Name of the Company you are applying to"
                        {...field}
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
                name="certifications"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Certifications (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="AWS Solutions Architect Associate"
                        {...field}
                        className="h-20 w-full"
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedValue = value.split('\n').map(line => line.startsWith('• ') ? line : `• ${line}`).join('\n').replace(/\n• $/, '\n');
                          field.onChange(formattedValue);
                        }}                                              
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="skills"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Relevant Skills (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Python"
                        {...field}
                        className="h-20 w-full"
                        onChange={(e) => {
                          const value = e.target.value;
                          const formattedValue = value.split('\n').map(line => line.startsWith('• ') ? line : `• ${line}`).join('\n').replace(/\n• $/, '\n');
                          field.onChange(formattedValue);
                        }}                         
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
              {messages.map((message, index) => (
                <div key={index} className="p-4 border rounded-md shadow-sm relative">
                  <button
                    className="absolute top-2 right-2 text-sm text-blue-500"
                    onClick={() => copyToClipboard(message)}
                  >
                    <FiCopy />
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

export default ResumeSummaryPage;
