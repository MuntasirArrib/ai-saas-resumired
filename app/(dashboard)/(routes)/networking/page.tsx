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
import { Linkedin } from "lucide-react";
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

const ResumeBulletPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetRole: "",
      targetCompany: "",
      currentRole: "",
      connectionName: "",
      connectionJobtitle: "",
    },
  });

  const isLoading = form.formState.isSubmitting || loading;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
  
      const prompt = `
      You are an expert in writing personalized LinkedIn connection request messages.
      Based on the following details, generate a message within 300 characters:

      1. Target Role: ${values.targetRole}
      2. Target Company: ${values.targetCompany}
      3. Current Role: ${values.currentRole}
      4. Connection Name: ${values.connectionName}
      5. Connection Job Title: ${values.connectionJobtitle}

      Ensure the message is friendly, mentions the connection's job title, and explains why you want to connect with them. Keep it within 300 characters.
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
        title="Neworking Message Generator"
        description="Connect with Industry Professionals 10x faster"
        icon={Linkedin}
        iconColor="text-blue-700"
        bgColor="bg-blue-700/10"
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
                name="targetRole"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Target Role</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        placeholder="e.g. Product Manager"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
             <FormField
                name="targetCompany"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Target Company</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        placeholder="e.g. Google"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                name="currentRole"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Current Role</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        placeholder="e.g. Systems Analyst"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                name="connectionName"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Name of the Person you are reaching out to</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        placeholder="e.g. Sundar Pichai"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
                name="connectionJobtitle"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormLabel>Job Title of the Person you are reaching out to</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        disabled={isLoading}
                        placeholder="e.g. CEO at Google"
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
