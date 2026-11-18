import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center gap-10 px-6 py-16 sm:px-12">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          {siteConfig.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          {siteConfig.description}
        </p>
      </header>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Project Foundation</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The application foundation is initialized. You can check the service
            health to verify that the API is responding.
          </p>
        </CardContent>
        <CardFooter>
          <form action="/api/health" method="get">
            <Button
              type="submit"
              className="min-h-11 motion-reduce:transition-none"
            >
              Check service health
              <ArrowUpRight aria-hidden="true" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </main>
  );
}
