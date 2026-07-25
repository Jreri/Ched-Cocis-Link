import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Lock, Unlock, Loader2, Building, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type StateRow = { state: string; placement_count: number };
type CityRow = { city: string; placement_count: number };
type UnlockedCity = { state: string; city: string };
type Company = {
  id: string;
  name: string;
  address: string;
  state: string;
  city: string | null;
  lga: string | null;
  business_district: string | null;
  description: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  logo_url: string | null;
};

const Placements = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [states, setStates] = useState<StateRow[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [cities, setCities] = useState<CityRow[]>([]);
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());
  const [payingKey, setPayingKey] = useState<string | null>(null);
  const [viewingCity, setViewingCity] = useState<{ state: string; city: string } | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [verifying, setVerifying] = useState(false);

  const key = (s: string, c: string) => `${s}|${c}`;

  const loadUnlocked = useCallback(async () => {
    const { data } = await supabase.rpc("get_my_unlocked_locations");
    const set = new Set<string>();
    (data as UnlockedCity[] | null)?.forEach((r) => set.add(key(r.state, r.city)));
    setUnlocked(set);
  }, []);

  const loadStates = useCallback(async () => {
    const { data, error } = await supabase.rpc("get_available_states");
    if (error) toast.error(error.message);
    setStates((data as StateRow[]) || []);
  }, []);

  // Auth + initial load
  useEffect(() => {
    let sub: any;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const isAuthed = !!data.session;
      setAuthed(isAuthed);
      if (isAuthed) {
        await Promise.all([loadStates(), loadUnlocked()]);
      }
      setLoading(false);
      sub = supabase.auth.onAuthStateChange((_e, session) => {
        setAuthed(!!session);
      }).data.subscription;
    })();
    return () => sub?.unsubscribe?.();
  }, [loadStates, loadUnlocked]);

  // Verify payment on return
  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    if (!reference || !authed) return;
    (async () => {
      setVerifying(true);
      try {
        const { data, error } = await supabase.functions.invoke("paystack-verify", {
          body: { reference },
        });
        if (error) throw error;
        if (data?.success) {
          toast.success(`Payment confirmed — ${data.city}, ${data.state} unlocked!`);
          await loadUnlocked();
          if (data.state) {
            setSelectedState(data.state);
            const { data: cityRows } = await supabase.rpc("get_available_cities", { _state: data.state });
            setCities((cityRows as CityRow[]) || []);
          }
        } else {
          toast.error("Payment was not completed");
        }
      } catch (e: any) {
        toast.error(e.message || "Verification failed");
      } finally {
        setVerifying(false);
        searchParams.delete("reference");
        searchParams.delete("trxref");
        setSearchParams(searchParams, { replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const openState = async (state: string) => {
    setSelectedState(state);
    setViewingCity(null);
    setCompanies([]);
    const { data, error } = await supabase.rpc("get_available_cities", { _state: state });
    if (error) toast.error(error.message);
    setCities((data as CityRow[]) || []);
  };

  const pay = async (state: string, city: string) => {
    setPayingKey(key(state, city));
    try {
      const callback = `${window.location.origin}/placements`;
      const { data, error } = await supabase.functions.invoke("paystack-init", {
        body: { state, city, callback_url: callback },
      });
      if (error) throw error;
      if (data?.already_paid) {
        toast.info("You already have access to this location");
        await loadUnlocked();
      } else if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error("No authorization URL returned");
      }
    } catch (e: any) {
      toast.error(e.message || "Could not start payment");
    } finally {
      setPayingKey(null);
    }
  };

  const viewCompanies = async (state: string, city: string) => {
    setViewingCity({ state, city });
    setCompanies([]);
    const { data, error } = await supabase.rpc("get_unlocked_companies", {
      _state: state,
      _city: city,
    });
    if (error) toast.error(error.message);
    setCompanies((data as Company[]) || []);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-32 pb-16 max-w-xl text-center">
          <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-display mb-2">Sign in to find placements</h1>
          <p className="text-muted-foreground mb-6">
            You need an account so we can match placements to your department.
          </p>
          <Button asChild size="lg">
            <Link to="/login">Sign in / Create account</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-16 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-display mb-2">Find your placement</h1>
          <p className="text-muted-foreground">
            Pick a state and city relevant to your department. Unlock a city for ₦3,000 to reveal every company's full details.
          </p>
        </div>

        {verifying && (
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Verifying payment…
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* States */}
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg">States ({states.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {states.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No placements matched your department yet. Make sure your profile has a department set.
                </p>
              )}
              {states.map((s) => (
                <button
                  key={s.state}
                  onClick={() => openState(s.state)}
                  className={`w-full text-left px-3 py-2 rounded-md border transition ${
                    selectedState === s.state
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-muted border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-medium">
                      <MapPin className="h-4 w-4" /> {s.state}
                    </span>
                    <Badge variant="secondary">{s.placement_count}</Badge>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Cities + companies */}
          <div className="lg:col-span-2 space-y-6">
            {!selectedState && (
              <Card>
                <CardContent className="py-16 text-center text-muted-foreground">
                  Select a state to see cities you can unlock.
                </CardContent>
              </Card>
            )}

            {selectedState && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Cities in {selectedState}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-3">
                  {cities.map((c) => {
                    const isUnlocked = unlocked.has(key(selectedState, c.city));
                    const k = key(selectedState, c.city);
                    return (
                      <div
                        key={c.city}
                        className="p-4 rounded-lg border bg-card flex flex-col gap-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold">{c.city}</div>
                            <div className="text-xs text-muted-foreground">
                              {c.placement_count} companies
                            </div>
                          </div>
                          {isUnlocked ? (
                            <Badge className="bg-emerald-600 hover:bg-emerald-600">
                              <Unlock className="h-3 w-3 mr-1" /> Unlocked
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Lock className="h-3 w-3 mr-1" /> Locked
                            </Badge>
                          )}
                        </div>
                        {isUnlocked ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => viewCompanies(selectedState, c.city)}
                          >
                            View companies
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => pay(selectedState, c.city)}
                            disabled={payingKey === k}
                          >
                            {payingKey === k ? (
                              <><Loader2 className="h-3 w-3 mr-2 animate-spin" /> Redirecting…</>
                            ) : (
                              <>Unlock ₦3,000</>
                            )}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                  {cities.length === 0 && (
                    <p className="text-sm text-muted-foreground col-span-full">
                      No cities available for your department here.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {viewingCity && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Companies — {viewingCity.city}, {viewingCity.state}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {companies.length === 0 && (
                    <p className="text-sm text-muted-foreground">Loading companies…</p>
                  )}
                  {companies.map((co) => (
                    <div key={co.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold">{co.name}</div>
                          <div className="text-sm text-muted-foreground mb-2">{co.address}</div>
                          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                            {co.contact_email && (
                              <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {co.contact_email}</span>
                            )}
                            {co.contact_phone && (
                              <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {co.contact_phone}</span>
                            )}
                            {co.business_district && (
                              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {co.business_district}</span>
                            )}
                          </div>
                        </div>
                        <Button asChild size="sm" className="shrink-0">
                          <Link to={`/apply/${co.id}`}>Apply for Internship</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Placements;
