import axios from 'axios'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import Title from '~/components/Title'

async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
  event.preventDefault()
  const data = new FormData(event.currentTarget)

  try {
    const response = await axios.post('/flask-api/predict', data)
    console.log(response.data)
  } catch (error) {
    console.error(error)
  }
}

export default function Detect(): JSX.Element {
  return (
    <div className="grid min-h-screen w-full">
      <Title>Detect</Title>

      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <h1 className="text-lg font-semibold md:text-2xl">Detect</h1>

        <div className="flex flex-1 flex-col items-center justify-center">
          <form
            encType="multipart/form-data"
            onSubmit={(event) => {
              void handleSubmit(event)
            }}
          >
            <div className="grid w-full max-w-sm gap-2">
              <Label htmlFor="picture">Picture</Label>
              <Input id="picture" name="picture" type="file" accept=".png, .jpg, .jpeg" />
            </div>

            <div>
              <Button className="mt-4" type="submit">
                Detect
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
