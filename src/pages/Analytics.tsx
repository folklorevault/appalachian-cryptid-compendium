import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Search, Filter, Eye, FileText, RefreshCw, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getToken } from "@/lib/api";

interface AnalyticsStats {
  totals: {
    total_events: number;
    unique_pages: number;
    total_page_views: number;
    total_searches: number;
    total_sightings: number;
  };
  popularCryptids: Array<{
    cryptid: string;
    views: number;
    last_viewed: string;
  }>;
  recentSearches: Array<{
    query: string;
    count: number;
    last_search: string;
  }>;
  filterStats: Array<{
    filter_type: string;
    uses: number;
    last_used: string;
  }>;
  dailyViews: Array<{
    date: string;
    views: number;
  }>;
  recentActivity: Array<{
    event: string;
    page: string;
    cryptid: string | null;
    timestamp: string;
  }>;
  generated_at: string;
}

const Analytics = () => {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        setError("Not authenticated. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/analytics/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header badge="Analytics" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Link to="/admin">
              <Button variant="outline">Back to Admin</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background paper-texture">
      <Header badge="Analytics Dashboard" />

      {/* Back Button & Refresh */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/admin">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
        </Link>
        <Button
          onClick={fetchStats}
          variant="outline"
          size="sm"
          className="border-primary text-primary"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="container mx-auto px-4 pb-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground font-display mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Last updated: {stats ? formatTime(stats.generated_at) : "—"}
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="border-2 border-border">
            <CardContent className="p-6 text-center">
              <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground">
                {stats?.totals.total_page_views || 0}
              </div>
              <div className="text-xs uppercase text-muted-foreground font-typewriter mt-1">
                Page Views
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardContent className="p-6 text-center">
              <Search className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground">
                {stats?.totals.total_searches || 0}
              </div>
              <div className="text-xs uppercase text-muted-foreground font-typewriter mt-1">
                Searches
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground">
                {stats?.totals.total_sightings || 0}
              </div>
              <div className="text-xs uppercase text-muted-foreground font-typewriter mt-1">
                Sightings
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardContent className="p-6 text-center">
              <Filter className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground">
                {stats?.filterStats.reduce((sum, f) => sum + f.uses, 0) || 0}
              </div>
              <div className="text-xs uppercase text-muted-foreground font-typewriter mt-1">
                Filter Uses
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-destructive mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground">
                {stats?.totals.total_events || 0}
              </div>
              <div className="text-xs uppercase text-muted-foreground font-typewriter mt-1">
                Total Events
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Cryptids & Recent Searches */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Popular Cryptids */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter">
                Most Popular Cryptids
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.popularCryptids && stats.popularCryptids.length > 0 ? (
                <div className="space-y-3">
                  {stats.popularCryptids.map((cryptid, index) => (
                    <div
                      key={cryptid.cryptid}
                      className="flex items-center justify-between border-b border-border pb-2 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                        >
                          {index + 1}
                        </Badge>
                        <div>
                          <div className="font-medium text-foreground capitalize">
                            {cryptid.cryptid.replace(/-/g, " ")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Last viewed: {formatDate(cryptid.last_viewed)}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary">
                        {cryptid.views} views
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No data yet</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Searches */}
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter">
                Top Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentSearches && stats.recentSearches.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-border pb-2 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-foreground">{search.query}</div>
                          <div className="text-xs text-muted-foreground">
                            Last: {formatDate(search.last_search)}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{search.count}x</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No searches yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Daily Views Chart */}
        <Card className="border-2 border-border mb-8">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter">
              Last 7 Days Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.dailyViews && stats.dailyViews.length > 0 ? (
              <div className="space-y-2">
                {stats.dailyViews.map((day) => {
                  const maxViews = Math.max(...stats.dailyViews.map((d) => d.views));
                  const percentage = (day.views / maxViews) * 100;
                  return (
                    <div key={day.date} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground">{formatDate(day.date)}</span>
                        <span className="text-muted-foreground">{day.views} views</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No activity yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Log */}
        <Card className="border-2 border-border">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-typewriter">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              <div className="space-y-2">
                {stats.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {activity.event}
                      </Badge>
                      <span className="text-foreground">
                        {activity.cryptid ? (
                          <span className="capitalize">{activity.cryptid.replace(/-/g, " ")}</span>
                        ) : (
                          activity.page
                        )}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No activity yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
