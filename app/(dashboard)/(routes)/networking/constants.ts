import * as z from "zod";

export const formSchema = z.object({
    targetRole: z.string().min(1, {
        message: "required."
    }),
    targetCompany: z.string().min(1, {
        message: "required."
    }),
    currentRole: z.string().min(1, {
        message: "required"
    }),
    connectionName: z.string().min(1, {
        message: "required."
    }),
    connectionJobtitle: z.string().min(1, {
        message: "required."
    }),
});
