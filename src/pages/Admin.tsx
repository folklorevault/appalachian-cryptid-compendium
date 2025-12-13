import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  LogIn,
  LogOut,
  Trash2,
  Check,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  useSightings,
  useUpdateSightingStatus,
  useDeleteSighting,
} from "@/hooks/use-sightings";
import { SightingReport } from "@/lib/api";

// Login form component
function LoginForm({
  onLogin,
  isLoading,
  error,
}: {
  onLogin: (key: string) => void;
  isLoading: boolean;
  error: Error | null;
}) {
  const [apiKey, setApiKey] = useState("");

  return (
    <Card className="max-w-md mx-auto mt-20 border-2 border-border">
      <CardHeader>
        <CardTitle className="text-center font-display text-primary">
          Admin Login
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your admin API key"
            className="bg-background border-border"
          />
        </div>
        {error && (
          <p className="text-sm text-destructive">
            {error.message || "Authentication failed"}
          </p>
        )}
        <Button
          onClick={() => onLogin(apiKey)}
          disabled={!apiKey || isLoading}
          className="w-full bg-primary text-primary-foreground"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// Sighting review card component
function SightingCard({
  report,
  onApprove,
  onReject,
  onDelete,
  isUpdating,
}: {
  report: SightingReport;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  isUpdating: boolean;
}) {
  return (
    <Card className="border-2 border-border">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-bold text-foreground">{report.witness_name}</h4>
            <p className="text-xs text-muted-foreground">{report.email}</p>
          </div>
          <Badge
            className={
              report.status === "pending"
                ? "bg-secondary"
                : report.status === "approved"
                ? "bg-accent"
                : "bg-destructive"
            }
          >
            {report.status}
          </Badge>
        </div>

        <div className="text-sm space-y-1">
          <p>
            <span className="text-muted-foreground">Date:</span> {report.date}
          </p>
          <p>
            <span className="text-muted-foreground">Location:</span>{" "}
            {report.location}, {report.state}
          </p>
          {report.creature_name && (
            <p>
              <span className="text-muted-foreground">Creature:</span>{" "}
              {report.creature_name}
            </p>
          )}
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Description:</p>
          <p className="text-foreground/80 line-clamp-3">{report.description}</p>
        </div>

        {report.status === "pending" && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={onApprove}
              disabled={isUpdating}
              className="bg-accent text-accent-foreground"
            >
              <Check className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onReject}
              disabled={isUpdating}
              className="border-destructive text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="ghost" className="text-muted-foreground">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Report?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this sighting report.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Main Admin component
const Admin = () => {
  const { isAuthenticated, isLoading: authLoading, login, logout, isLoggingIn, loginError } =
    useAuth();

  // Sighting queries
  const { data: sightingsData, isLoading: sightingsLoading } = useSightings({
    status: "pending",
  });
  const updateSightingStatus = useUpdateSightingStatus();
  const deleteSighting = useDeleteSighting();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background dark">
        <Header badge="Admin" />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background dark">
        <Header badge="Admin" />
        <LoginForm
          onLogin={login}
          isLoading={isLoggingIn}
          error={loginError}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark">
      <Header badge="Admin" />

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground font-display">
            Admin Dashboard
          </h1>
          <Button
            variant="outline"
            onClick={logout}
            className="border-border text-muted-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Sanity Studio Link */}
        <Card className="border-2 border-primary/50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground">Manage Cryptids</h3>
                <p className="text-sm text-muted-foreground">
                  Add, edit, and manage cryptid entries with testimonies, notable sightings, and bureau notes in Sanity Studio.
                </p>
              </div>
              <a
                href="https://cryptid.sanity.studio"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-primary text-primary-foreground">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Sanity Studio
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Sighting Reports Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground font-display">
              Sighting Reports
            </h2>
            {sightingsData?.total ? (
              <Badge className="bg-secondary text-secondary-foreground">
                {sightingsData.total} pending
              </Badge>
            ) : null}
          </div>

          <p className="text-sm text-muted-foreground">
            Review and moderate user-submitted sighting reports.
          </p>

          {sightingsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sightingsData?.reports.length === 0 ? (
            <Card className="border-2 border-border">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No pending reports</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {sightingsData?.reports.map((report) => (
                <SightingCard
                  key={report.id}
                  report={report}
                  onApprove={() =>
                    updateSightingStatus.mutate({
                      id: report.id,
                      status: "approved",
                    })
                  }
                  onReject={() =>
                    updateSightingStatus.mutate({
                      id: report.id,
                      status: "rejected",
                    })
                  }
                  onDelete={() => deleteSighting.mutate(report.id)}
                  isUpdating={updateSightingStatus.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
