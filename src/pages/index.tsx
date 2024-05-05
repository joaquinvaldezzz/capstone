import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import type { SubmitHandler } from "react-hook-form"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"

const schema = z.object({
  username: z.string().min(4, "Your username must be at least 4 characters."),
  password: z.string().min(8, "Your password must be at least 8 characters."),
})

type InputValues = z.infer<typeof schema>

export default function Home(): JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<InputValues>({
    resolver: zodResolver(schema),
  })
  const [form, setForm] = useState<InputValues>({
    username: "",
    password: "",
  })

  /**
   * Handles the form submission.
   *
   * @param data - The form data to be submitted.
   * @returns A Promise that resolves when the submission is successful.
   */
  async function onSubmit(data: SubmitHandler<InputValues>): Promise<void> {
    try {
      const response = await axios.post("http://localhost:5050/record/log-in", data)

      if (response.status === 200) {
        setForm({
          username: "",
          password: "",
        })
        reset()

        console.log("Logged in", response.status)
      }
    } catch (error) {
      console.error("Invalid password")
    }
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-balance text-muted-foreground">Please enter your details.</p>
          </div>

          <form
            className="grid gap-4"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleSubmit(onSubmit as unknown as SubmitHandler<InputValues>)}
          >
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register("username")}
                data-error={errors.username != null}
                type="text"
                value={form.username}
                placeholder=""
                onChange={(event) => {
                  setForm({ ...form, username: event.target.value })
                }}
              />
              {errors.username?.message != null && (
                <p className="text-error-primary text-sm">{errors.username?.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link className="ml-auto inline-block text-sm underline" href="/forgot-password">
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                {...register("password")}
                data-error={errors.password != null}
                type="password"
                value={form.password}
                placeholder=""
                onChange={(event) => {
                  setForm({ ...form, password: event.target.value })
                }}
              />
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden lg:block lg:bg-muted">
        <Image
          className="size-full object-cover"
          src="/images/sign-up/milad-fakurian-eRbgsJ0Ec0o-unsplash.jpg"
          width="1920"
          height="1080"
          alt=""
          priority
        />
      </div>
    </div>
  )
}
