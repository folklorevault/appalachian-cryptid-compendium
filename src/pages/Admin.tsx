import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogIn,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  useCryptids,
  useCreateCryptid,
  useUpdateCryptid,
  useDeleteCryptid,
} from "@/hooks/use-cryptids";
import {
  useSightings,
  useUpdateSightingStatus,
  useDeleteSighting,
} from "@/hooks/use-sightings";
import { CryptidInput, SightingReport } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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

// Cryptid form component
function CryptidForm({
  initialData,
  onSubmit,
  isLoading,
}: {
  initialData?: CryptidInput;
  onSubmit: (data: CryptidInput) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<CryptidInput>(
    initialData || {
      name: "",
      scientific_name: "",
      location: "",
      region: "appalachia",
      danger_level: "Medium",
      sightings: 0,
      description: "",
      image: "",
      tags: [],
      physical_description: "",
      behavior: "",
      habitat: "",
      diet: "",
    }
  );

  const handleChange = (field: keyof CryptidInput, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name *</Label>
          <Input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Cryptid name"
            className="bg-background border-border"
          />
        </div>
        <div className="space-y-2">
          <Label>Scientific Name</Label>
          <Input
            value={formData.scientific_name}
            onChange={(e) => handleChange("scientific_name", e.target.value)}
            placeholder="Latin name"
            className="bg-background border-border"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Location *</Label>
          <Input
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Primary location"
            className="bg-background border-border"
          />
        </div>
        <div className="space-y-2">
          <Label>Region *</Label>
          <Select
            value={formData.region}
            onValueChange={(value) => handleChange("region", value)}
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appalachia">Appalachia</SelectItem>
              <SelectItem value="southeast">Southeast</SelectItem>
              <SelectItem value="southern">Southern</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Danger Level *</Label>
          <Select
            value={formData.danger_level}
            onValueChange={(value) =>
              handleChange("danger_level", value as "Low" | "Medium" | "High")
            }
          >
            <SelectTrigger className="bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Sightings</Label>
          <Input
            type="number"
            value={formData.sightings}
            onChange={(e) => handleChange("sightings", parseInt(e.target.value) || 0)}
            className="bg-background border-border"
          />
        </div>
        <div className="space-y-2">
          <Label>Last Sighting</Label>
          <Input
            value={formData.last_sighting}
            onChange={(e) => handleChange("last_sighting", e.target.value)}
            placeholder="e.g., March 2024"
            className="bg-background border-border"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Image URL</Label>
        <Input
          value={formData.image}
          onChange={(e) => handleChange("image", e.target.value)}
          placeholder="/assets/cryptid-name.jpg"
          className="bg-background border-border"
        />
      </div>

      <div className="space-y-2">
        <Label>Tags (comma-separated)</Label>
        <Input
          value={formData.tags?.join(", ")}
          onChange={(e) =>
            handleChange(
              "tags",
              e.target.value.split(",").map((t) => t.trim()).filter(Boolean)
            )
          }
          placeholder="Nocturnal, Winged, Aggressive"
          className="bg-background border-border"
        />
      </div>

      <div className="space-y-2">
        <Label>Short Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Brief overview..."
          rows={2}
          className="bg-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Physical Description</Label>
        <Textarea
          value={formData.physical_description}
          onChange={(e) => handleChange("physical_description", e.target.value)}
          placeholder="Detailed physical characteristics..."
          rows={3}
          className="bg-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Behavior</Label>
        <Textarea
          value={formData.behavior}
          onChange={(e) => handleChange("behavior", e.target.value)}
          placeholder="Observed behaviors..."
          rows={3}
          className="bg-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Habitat</Label>
        <Textarea
          value={formData.habitat}
          onChange={(e) => handleChange("habitat", e.target.value)}
          placeholder="Preferred habitat..."
          rows={2}
          className="bg-background border-border resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Diet</Label>
        <Textarea
          value={formData.diet}
          onChange={(e) => handleChange("diet", e.target.value)}
          placeholder="Known or suspected diet..."
          rows={2}
          className="bg-background border-border resize-none"
        />
      </div>

      <Button
        onClick={() => onSubmit(formData)}
        disabled={!formData.name || !formData.location || isLoading}
        className="w-full bg-primary text-primary-foreground"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Cryptid"
        )}
      </Button>
    </div>
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
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, login, logout, isLoggingIn, loginError } =
    useAuth();

  const [editingCryptid, setEditingCryptid] = useState<CryptidInput | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Cryptid queries
  const { data: cryptids, isLoading: cryptidsLoading } = useCryptids();
  const createCryptid = useCreateCryptid();
  const updateCryptid = useUpdateCryptid();
  const deleteCryptid = useDeleteCryptid();

  // Sighting queries
  const { data: sightingsData, isLoading: sightingsLoading } = useSightings({
    status: "pending",
  });
  const updateSightingStatus = useUpdateSightingStatus();
  const deleteSighting = useDeleteSighting();

  const handleCreateCryptid = async (data: CryptidInput) => {
    try {
      await createCryptid.mutateAsync(data);
      setIsCreateDialogOpen(false);
      toast({ title: "Cryptid created successfully" });
    } catch (error) {
      toast({
        title: "Error creating cryptid",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateCryptid = async (data: CryptidInput) => {
    if (!editingCryptid?.id) return;
    try {
      await updateCryptid.mutateAsync({ id: editingCryptid.id, updates: data });
      setIsEditDialogOpen(false);
      setEditingCryptid(null);
      toast({ title: "Cryptid updated successfully" });
    } catch (error) {
      toast({
        title: "Error updating cryptid",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCryptid = async (id: string) => {
    try {
      await deleteCryptid.mutateAsync(id);
      toast({ title: "Cryptid deleted successfully" });
    } catch (error) {
      toast({
        title: "Error deleting cryptid",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

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

        <Tabs defaultValue="cryptids" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="cryptids">Manage Cryptids</TabsTrigger>
            <TabsTrigger value="sightings">
              Sighting Reports
              {sightingsData?.total ? (
                <Badge className="ml-2 bg-secondary text-secondary-foreground">
                  {sightingsData.total}
                </Badge>
              ) : null}
            </TabsTrigger>
          </TabsList>

          {/* Cryptids Tab */}
          <TabsContent value="cryptids" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {cryptids?.length || 0} cryptids in database
              </p>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Cryptid
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Cryptid</DialogTitle>
                  </DialogHeader>
                  <CryptidForm
                    onSubmit={handleCreateCryptid}
                    isLoading={createCryptid.isPending}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {cryptidsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-4">
                {cryptids?.map((cryptid) => (
                  <Card key={cryptid.id} className="border-2 border-border">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {cryptid.image && (
                          <img
                            src={cryptid.image}
                            alt={cryptid.name}
                            className="w-16 h-16 object-cover rounded border border-border"
                          />
                        )}
                        <div>
                          <h3 className="font-bold text-foreground">
                            {cryptid.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {cryptid.location}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {cryptid.region}
                            </Badge>
                            <Badge
                              className={
                                cryptid.danger_level === "High"
                                  ? "bg-destructive"
                                  : cryptid.danger_level === "Medium"
                                  ? "bg-secondary"
                                  : "bg-accent"
                              }
                            >
                              {cryptid.danger_level}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/cryptid/${cryptid.id}`}>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Dialog
                          open={isEditDialogOpen && editingCryptid?.id === cryptid.id}
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open);
                            if (!open) setEditingCryptid(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setEditingCryptid({
                                  id: cryptid.id,
                                  name: cryptid.name,
                                  scientific_name: cryptid.scientific_name,
                                  location: cryptid.location,
                                  region: cryptid.region,
                                  danger_level: cryptid.danger_level,
                                  sightings: cryptid.sightings,
                                  last_sighting: cryptid.last_sighting,
                                  description: cryptid.description,
                                  image: cryptid.image,
                                  tags: cryptid.tags,
                                  physical_description: cryptid.physical_description,
                                  behavior: cryptid.behavior,
                                  habitat: cryptid.habitat,
                                  diet: cryptid.diet,
                                })
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Cryptid</DialogTitle>
                            </DialogHeader>
                            {editingCryptid && (
                              <CryptidForm
                                initialData={editingCryptid}
                                onSubmit={handleUpdateCryptid}
                                isLoading={updateCryptid.isPending}
                              />
                            )}
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete {cryptid.name}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this cryptid and all
                                associated testimonies and timeline events.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCryptid(cryptid.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Sightings Tab */}
          <TabsContent value="sightings" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {sightingsData?.total || 0} pending sighting reports
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

