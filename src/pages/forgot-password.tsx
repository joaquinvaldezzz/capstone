import Link from 'next/link'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

export default function ForgotPassword(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot password</CardTitle>
          <CardDescription>No worries, we&apos;ll send you reset instructions.</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="" />
            </div>

            <Button className="w-full" type="submit">
              Reset password
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            <Link href="/" className="underline">
              Back to log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
