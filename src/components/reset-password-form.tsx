"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { resetPassword } from "@/lib/actions";
import { resetPasswordFormSchema } from "@/lib/form-schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { FormEvent } from "react";
import type { ResetPasswordFormSchema } from "@/lib/form-schema";

interface ResetPasswordFormProps {
  token?: string;
}

function ResetPasswordForm({ token = "" }: ResetPasswordFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [formState, formAction, isSubmitting] = useActionState(resetPassword, { message: "" });
  const form = useForm<ResetPasswordFormSchema>({
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",

      // Override the default values with the previous form state fields
      ...formState.fields,
    },
    resolver: zodResolver(resetPasswordFormSchema),
  });

  /**
   * Handles the form submission event.
   *
   * @param event - The form submission event.
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Prevent the default form submission behavior
    event.preventDefault();

    form.handleSubmit(() => {
      startTransition(() => {
        // If the form reference is null, return early
        if (formRef.current == null) return;

        // Perform the form action with the form data
        formAction(new FormData(formRef.current));
      });
    })(event);
  }

  useEffect(() => {
    // If the form state success is true, reset the form fields
    if (formState.success ?? false) {
      form.reset({ token, password: "", confirmPassword: "" });
    }
  }, [formState, form, token]);

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Reset password</CardTitle>
        <CardDescription>
          Enter your new password below to reset your account password.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {formState.message.length > 0 &&
          ((formState.success ?? false) ? (
            <Alert className="mb-4" variant="success">
              <CircleCheck className="size-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>{formState.message}</p>
                <div>
                  <Link className="font-semibold underline" href="/">
                    Proceed to login
                  </Link>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="mb-4" variant="destructive">
              <CircleAlert className="size-4" />
              <AlertTitle>Oops!</AlertTitle>
              <AlertDescription>{formState.message}</AlertDescription>
            </Alert>
          ))}

        {!token && (
          <Alert className="mb-4" variant="destructive">
            <CircleAlert className="size-4" />
            <AlertTitle>Invalid link</AlertTitle>
            <AlertDescription>
              Password reset token is missing. Please request a new password reset link.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form className="grid gap-4" action={formAction} ref={formRef} onSubmit={handleSubmit}>
            <input type="hidden" {...form.register("token")} value={token} />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>New password</FormLabel>
                    <Button
                      className="h-auto p-0"
                      type="button"
                      variant="link"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? "Hide password" : "Show password"}
                    </Button>
                  </div>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Confirm password</FormLabel>
                    <Button
                      className="h-auto p-0"
                      type="button"
                      variant="link"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? "Hide password" : "Show password"}
                    </Button>
                  </div>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={!token || isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              {isSubmitting ? "Resetting password..." : "Reset password"}
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          <Link className="underline" href="/">
            Return to login page
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default ResetPasswordForm;
