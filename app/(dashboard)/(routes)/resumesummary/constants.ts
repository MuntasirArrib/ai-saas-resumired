import * as z from "zod";

export const formSchema = z.object({
    currentJobTitle: z.string().min(1, {
        message: "required."
    }),
    applyingJobTitle: z.string().min(1, {
      message: "required."
  }),
  companyName: z.string().min(1, {
    message: "required."
}),
    certifications: z.string().min(0, {
        message: "required."
    }),
    skills: z.string().min(0, {
        message: "Skills are required."
    }),
    yearsOfExperience: z.string().min(1, {
        message: "required."
    }),
    jobDescription: z.string().min(1, {
        message: "required."
    }),
});
