import z from "zod";

interface ValidationError {
  field: string | number;
  message: string;
}

export const ParseZodError = (err: z.ZodError): ValidationError[] => {
  let ValidationError: ValidationError[] = [];
  err.issues.forEach((issue) => {
    ValidationError.push({
      field: issue.path[0],
      message: issue.message,
    });
  });

  return ValidationError;
};
