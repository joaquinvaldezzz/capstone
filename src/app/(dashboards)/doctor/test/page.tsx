import { sql } from 'drizzle-orm'

import { db } from '@/lib/db'

export default async function Page() {
  const { rows } = await db.execute(
    sql`SELECT * FROM results t1  JOIN users t2 ON t1.user_id = t2.user_id;`,
  )

  if (rows.length === 0) return

  const results = Array.from(rows)

  return (
    <div>
      <h1>Results</h1>
      <ul className="list-decimal pl-4">
        {results.map((result) => (
          <li key={result.result_id}>
            <p>
              {result.first_name} {result.last_name}
            </p>
            <p>{result.diagnosis}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
