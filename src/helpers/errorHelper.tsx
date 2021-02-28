import * as Sentry from "@sentry/react";
import { toast } from "react-toastify";

/**
 * Captures an error, logs it to the correct out (sentry or console) and prints out a toast
 *
 * @param error error to log
 * @param message message that will be shown instead of error.message
 */
export function captureError(error: any, message?: string): void
{
  if(process.env.NODE_ENV === "production")
    Sentry.captureException(error)
  else
    console.error(error.message, error.stack)

  toast.error(message || error?.message || "Internal Server Error"); //todo i18n
}