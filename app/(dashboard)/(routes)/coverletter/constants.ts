import * as z from "zod";

export const formSchema = z.object({
  resume: z.any().optional().refine((file) => {
    if (!file) return true; // Allow empty file field
    const allowedTypes = ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    return allowedTypes.includes(file.type);
  }, {
    message: "Uploaded resume must be a Word document (.doc or .docx)."
  }),
  jobDescription: z.string().max(6500, {
    message: "Job description must be less than 6500 characters."
  }).min(1, {
    message: "Job description is required."
  }),
  hiringManager: z.string().min(0, {
    message: "Name of the hiring manager?"
  }),
});
