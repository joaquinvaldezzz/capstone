import Link from "next/link";
import { redirect } from "next/navigation";

import { format } from "date-fns";
import { Activity, Calendar, FileText, Stethoscope } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCurrentUser, getResultsByPatientId } from "@/lib/dal";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inbox",
};

export default async function Page() {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== "patient") {
    redirect("/");
  }

  const results = (await getResultsByPatientId(currentUser.user_id)) ?? [];

  const hasResults = results.length > 0;
  const latestResult = hasResults ? results[0] : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Welcome back, {currentUser.first_name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your diagnostic ultrasound reports, AI analysis insights, and physician notes.
        </p>
      </div>

      {!hasResults ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center sm:p-12">
          <div className="mb-4 rounded-full bg-muted p-4">
            <FileText className="size-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">No Ultrasound Results</CardTitle>
          <CardDescription className="mt-2 max-w-md text-center text-sm">
            No ultrasound results yet. When your doctor uploads your ultrasound scan, your report
            will appear here.
          </CardDescription>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Quick overview metric cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Scans
                </CardTitle>
                <Activity className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{results.length}</div>
                <p className="mt-1 text-xs text-muted-foreground">Ultrasound examination reports</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Latest Scan Date
                </CardTitle>
                <Calendar className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestResult ? format(new Date(latestResult.created_at), "MMM d, yyyy") : "N/A"}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Most recent diagnostic imaging</p>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Primary Physician
                </CardTitle>
                <Stethoscope className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="truncate text-2xl font-bold">
                  {latestResult
                    ? `Dr. ${latestResult.doctor_first_name} ${latestResult.doctor_last_name}`
                    : "N/A"}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Attending healthcare provider</p>
              </CardContent>
            </Card>
          </div>

          {/* Results list */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Diagnostic Results</CardTitle>
              <CardDescription>
                A comprehensive record of your completed ultrasound scans and clinical
                interpretations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Desktop & Tablet Table view */}
              <div className="hidden rounded-md border md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Attending Physician</TableHead>
                      <TableHead>Status / Clinical Summary</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.result_id}>
                        <TableCell className="font-medium whitespace-nowrap">
                          {format(new Date(result.created_at), "MMMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          Dr. {result.doctor_first_name} {result.doctor_last_name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {result.diagnosis === "Infected" ? (
                              <Badge
                                variant="outline"
                                className="border-amber-300 bg-amber-50 text-amber-800"
                              >
                                PCOS Indicators Detected
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="border-emerald-300 bg-emerald-50 text-emerald-800"
                              >
                                Normal Ovarian Morphology
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              ({result.percentage} confidence)
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/patient/result/${result.result_id}`}>
                              View Full Report
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card list view */}
              <div className="flex flex-col gap-3 md:hidden">
                {results.map((result) => (
                  <div
                    key={result.result_id}
                    className="flex flex-col gap-3 rounded-lg border p-4 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        {format(new Date(result.created_at), "MMM d, yyyy")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {result.percentage} confidence
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Attending: Dr. {result.doctor_first_name} {result.doctor_last_name}
                    </div>
                    <div>
                      {result.diagnosis === "Infected" ? (
                        <Badge
                          variant="outline"
                          className="border-amber-300 bg-amber-50 text-amber-800"
                        >
                          PCOS Indicators Detected
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-emerald-300 bg-emerald-50 text-emerald-800"
                        >
                          Normal Ovarian Morphology
                        </Badge>
                      )}
                    </div>
                    <Button asChild size="sm" variant="outline" className="mt-1 w-full">
                      <Link href={`/patient/result/${result.result_id}`}>View Full Report</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
