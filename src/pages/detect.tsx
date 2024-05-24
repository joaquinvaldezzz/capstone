import { useState } from 'react'
import axios from 'axios'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import Title from '~/components/Title'

interface Result {
  percentage: string
  result: string
}

export default function Detect(): JSX.Element {
  const [result, setResult] = useState<Result>({ percentage: '', result: '' })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    const image = new FormData(event.currentTarget)

    try {
      const response = await axios.post('/flask-api/predict', image)
      console.log(response.data)
      setResult(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="grid min-h-screen w-full">
      <Title>Detect</Title>

      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <h1 className="text-lg font-semibold md:text-2xl">Detect</h1>

        <div className="max-w-screen-sm">
          <form
            onSubmit={(event) => {
              void handleSubmit(event)
            }}
          >
            <div className="grid w-full max-w-sm gap-2">
              <Label htmlFor="picture">Picture</Label>
              <Input id="picture" name="picture" type="file" accept=".png, .jpg, .jpeg" />
            </div>

            <div className="mt-4">
              <Button type="submit">Detect</Button>
            </div>
          </form>

          <p className="mt-4 text-left text-lg font-semibold">
            {result.percentage} {result.result}
          </p>
        </div>
      </main>
    </div>
  )
}
