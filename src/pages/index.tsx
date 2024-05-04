import { useState } from "react"
import { useForm } from "react-hook-form"
import Image from "next/image"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { z } from "zod"
import Title from "~/components/Title"
import GridPatternLarge from "~/public/images/bg-pattern-lg.svg"
import GridPattern from "~/public/images/bg-pattern.svg"
import type { SubmitHandler } from "react-hook-form"

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
  const [isPasswordVisible, setisPasswordVisible] = useState<boolean>(false)

  /**
   * Handles the form submission.
   *
   * @param data - The form data to be submitted.
   * @returns A Promise that resolves when the submission is successful.
   */
  async function onSubmit(data: SubmitHandler<InputValues>): Promise<void> {
    try {
      // Send the data to the server
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
    <div className="overflow-x-clip">
      <Title>Log in</Title>

      <div className="grid min-h-screen grid-cols-1 items-center md:grid-cols-2">
        <div className="flex h-full flex-col justify-center">
          <div className="flex w-full flex-col gap-8 px-4 py-12 md:mx-auto md:max-w-90 lg:p-0">
            <div className="relative">
              <GridPattern className="absolute left-1/2 top-1/2 -z-10 size-[30rem] -translate-x-1/2 -translate-y-1/2 md:hidden" />
              <GridPatternLarge className="hidden md:absolute md:left-1/2 md:top-1/2 md:-z-10 md:block md:size-[48rem] md:-translate-x-1/2 md:-translate-y-1/2" />
              <Image
                className="mx-auto size-10 rounded-[0.625rem] shadow-xs md:size-12"
                src="/images/logo.png"
                width="48"
                height="48"
                alt="Skyline Hospital and Medical Center"
                priority
              />
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-center text-display-xs font-semibold text-primary md:text-display-sm">
                  Welcome back
                </h1>
                <p className="text-center text-tertiary">Please enter your details.</p>
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
                  className="rounded-lg bg-primary-bg px-3.5 py-2.5 text-primary shadow-xs ring-1 ring-inset ring-primary-border transition placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-border data-error:ring-error-primary"
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
                {errors.username?.message != null && (
                  <p className="text-sm text-error-primary">{errors.username?.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-secondary" htmlFor="password">
                  Password
                </label>
                <div className="relative flex flex-col">
                  <input
                    className="rounded-lg bg-primary-bg px-3.5 py-2.5 text-primary shadow-xs ring-1 ring-inset ring-primary-border transition placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-border data-error:ring-error-primary"
                    id="password"
                    {...register("password")}
                    data-error={errors.password != null}
                    type={isPasswordVisible ? "text" : "password"}
                    value={form.password}
                    autoComplete="current-password"
                    placeholder=""
                    onChange={(event) => {
                      setForm({ ...form, password: event.target.value })
                    }}
                  />
                  <button
                    className="absolute right-0 top-1/2 z-10 size-11 -translate-y-1/2 p-3 text-primary"
                    type="button"
                    onClick={() => {
                      setisPasswordVisible(!isPasswordVisible)
                    }}
                  >
                    <span className="sr-only">
                      {isPasswordVisible ? "Hide password" : "Show password"}
                    </span>
                    {isPasswordVisible ? (
                      <EyeSlashIcon className="size-5" />
                    ) : (
                      <EyeIcon className="size-5" />
                    )}
                  </button>
                </div>
                {errors.password?.message != null && (
                  <p className="text-sm text-error-primary">{errors.password?.message}</p>
                )}
              </div>

              <button
                className="rounded-lg border border-button-primary-border bg-button-primary-bg px-4 py-2.5 font-semibold text-button-primary-fg shadow-xs transition focus:outline-none focus:ring-4 focus:ring-brand-500/25 focus:ring-offset-light-900"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>

        <div className="hidden md:relative md:block md:h-full">
          <Image
            className="object-cover"
            src="/images/sign-up/milad-fakurian-eRbgsJ0Ec0o-unsplash.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>
      </div>
    </div>
  )
}
