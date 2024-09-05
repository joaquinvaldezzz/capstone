'use client'

export default function Page() {
  return (
    <div>
      <header className="border-b border-b-gray-200 pb-5">
        <div className="flex justify-between gap-4">
          <div>
            <h1 className="text-display-sm font-semibold">Dashboard</h1>
            <p className="mt-1 text-gray-600">
              Welcome to your dashboard. Here you can view your team&apos;s performance and manage
              your account.
            </p>
          </div>
        </div>
      </header>
    </div>
  )
}
