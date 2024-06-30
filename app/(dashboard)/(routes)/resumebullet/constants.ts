import * as z from "zod";

export const formSchema = z.object({
    category: z.string().min(1, {
        message: "Category is required."
    }),
    role: z.string().min(1, {
        message: "Role is required."
    }),
    yearsOfExperience: z.string().min(1, {
        message: "Years of experience is required"
    }),
    jobDescription: z.string().min(1, {
        message: "Job description is required."
    }),
    resume: z.string().min(1, {
        message: "Resume is required."
    }),
});
