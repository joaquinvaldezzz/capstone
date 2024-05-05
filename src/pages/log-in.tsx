import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { z } from "zod"

import Title from "~/components/Title"

const schema = z.object({
  username: z.string().min(4, "Your username must be at least 4 characters."),
  password: z.string().min(8, "Your password must be at least 8 characters."),
})

type InputValues = z.infer<typeof schema>

/**
 * Renders the log-in page.
 *
 * @returns The log-in page component.
 */
export default function LogIn(): JSX.Element {
  const {
    register,
    handleSubmit,
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
    await fetch("http://localhost:5050/record/", {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        console.log("Done")
      })
  }

  return (
    <div>
      <Title>Log in</Title>

      <div className="grid min-h-screen grid-cols-1 items-center md:grid-cols-2">
        <div className="flex h-full flex-col justify-between">
          <header className="px-8 pt-8">
            <div className="h-8"></div>
          </header>

          <div className="md:max-w-90 flex w-full flex-col gap-8 px-4 py-12 md:mx-auto lg:p-0">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-display-xs md:text-display-sm font-semibold text-primary">
                  Log in
                </h1>
                <p className="text-tertiary">
                  Log in to your account to access the Skyline Hospital and Medical Center services.
                </p>
              </div>
            </div>

            <form
              className="flex flex-col gap-6"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onSubmit={handleSubmit(onSubmit as unknown as SubmitHandler<InputValues>)}
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-secondary" htmlFor="username">
                  Username
                </label>
                <input
                  className="bg-primary-bg shadow-xs ring-primary-border placeholder:text-placeholder focus:ring-brand-border data-error:ring-error-primary rounded-lg px-3.5 py-2.5 text-primary ring-1 ring-inset transition focus:outline-none focus:ring-2 focus:ring-inset"
                  id="username"
                  {...register("username")}
                  data-error={errors.username != null}
                  type="text"
                  value={form.username}
                  autoComplete="given-name"
                  placeholder=""
                  onChange={(event) => {
                    setForm({ ...form, username: event.target.value })
                  }}
                />
                <p className="text-error-primary h-5 text-sm">{errors.username?.message}</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-secondary" htmlFor="password">
                  Password
                </label>
                <input
                  className="bg-primary-bg shadow-xs ring-primary-border placeholder:text-placeholder focus:ring-brand-border data-error:ring-error-primary rounded-lg px-3.5 py-2.5 text-primary ring-1 ring-inset transition focus:outline-none focus:ring-2 focus:ring-inset"
                  id="password"
                  {...register("password")}
                  data-error={errors.password != null}
                  type="password"
                  value={form.password}
                  autoComplete="current-password"
                  placeholder=""
                  onChange={(event) => {
                    setForm({ ...form, password: event.target.value })
                  }}
                />
                <p className="text-error-primary h-5 text-sm">{errors.password?.message}</p>
              </div>

              <button
                className="border-button-primary-border bg-button-primary-bg text-button-primary-fg shadow-xs focus:ring-brand-500/25 focus:ring-offset-light-900 rounded-lg border px-4 py-2.5 font-semibold transition focus:outline-none focus:ring-4"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="text-tertiary text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link className="text-button-tertiary-color-fg font-semibold" href="/sign-up">
                Sign up
              </Link>
            </p>
          </div>

          <footer className="px-8 pb-8">
            <p className="text-tertiary text-sm">
              &copy; Skyline Hospital and Medical Center {new Date().getFullYear()}
            </p>
          </footer>
        </div>

        <div className="relative h-full">
          <Image
            className="object-cover"
            src="/images/sign-up/milad-fakurian-eRbgsJ0Ec0o-unsplash.jpg"
            alt="Log in banner"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>
      </div>
    </div>
  )
}
