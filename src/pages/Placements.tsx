import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import CompanyDirectory from "@/components/CompanyDirectory";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Lock, Unlock, Loader2, Building, Mail, Phone, Search } from "lucide-react";
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
  const [directoryToken, setDirectoryToken] = useState(0);
  const [citySearch, setCitySearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const companiesRef = useRef<HTMLDivElement | null>(null);
  const verifiedRefs = useRef<Set<string>>(new Set());


  const key = (s: string, c: string) => `${s}|${c}`;

  const loadUnlocked = useCallback(async () => {
    const { data } = await supabase.rpc("get_my_unlocked_locations");
    const set = new Set<string>();
    (data as UnlockedCity[] | null)?.forEach((r) => set.add(key(r.state, r.city)));
    setUnlocked(set);
    return set;
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

  // Keep unlock state fresh when the tab regains focus (e.g. after paying in another tab)
  useEffect(() => {
    if (!authed) return;
    const onFocus = () => { loadUnlocked(); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [authed, loadUnlocked]);

  // Verify payment on return from Paystack — retries transient failures automatically.
  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");
    if (!reference || !authed) return;
    if (verifiedRefs.current.has(reference)) return;
    verifiedRefs.current.add(reference);

    // Strip the reference from the URL right away so a refresh can't re-trigger anything.
    const next = new URLSearchParams(searchParams);
    next.delete("reference");
    next.delete("trxref");
    setSearchParams(next, { replace: true });

    (async () => {
      setVerifying(true);
      let lastError = "";
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const { data, error } = await supabase.functions.invoke("paystack-verify", {
            body: { reference },
          });
          if (error) throw error;
          if (data?.error) throw new Error(data.error);

          if (data?.success) {
            // Unlock instantly: update local state before any network round-trip finishes.
            if (data.state && data.city) {
              setUnlocked((prev) => new Set(prev).add(key(data.state, data.city)));
            }
            toast.success(`Payment confirmed — ${data.city}, ${data.state} unlocked!`);
            await Promise.all([loadUnlocked(), loadStates()]);
            setDirectoryToken((t) => t + 1);
            if (data.state && data.city) {
              await openStateAndView(data.state, data.city);
            }
            setVerifying(false);
            return;
          }

          // Paystack says the transaction isn't successful (yet) — brief retry, then report.
          lastError = "Payment was not completed";
        } catch (e: any) {
          lastError = e?.message || "Verification failed";
        }
        await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
      }

      // Final fallback: the webhook/verify may have landed anyway.
      const set = await loadUnlocked();
      if (set.size > 0) setDirectoryToken((t) => t + 1);
      toast.error(`${lastError}. If you were charged, refresh in a moment — access is applied automatically.`);
      setVerifying(false);
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

  const viewCompanies = async (state: string, city: string) => {
    setViewingCity({ state, city });
    setCompanies([]);
    const { data, error } = await supabase.rpc("get_unlocked_companies", {
      _state: state,
      _city: city,
    });
    if (error) toast.error(error.message);
    setCompanies((data as Company[]) || []);
    // scroll to companies section after paint
    setTimeout(() => {
      companiesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const openStateAndView = async (state: string, city: string) => {
    setSelectedState(state);
    const { data } = await supabase.rpc("get_available_cities", { _state: state });
    setCities((data as CityRow[]) || []);
    await viewCompanies(state, city);
  };

  // Deep-link support: ?state=X&city=Y
  useEffect(() => {
    if (!authed) return;
    const qState = searchParams.get("state");
    const qCity = searchParams.get("city");
    if (qState && qCity && (!viewingCity || viewingCity.city !== qCity || viewingCity.state !== qState)) {
      openStateAndView(qState, qCity);
    } else if (qState && !qCity && selectedState !== qState) {
      openState(qState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, searchParams]);

  const pay = async (state: string, city: string) => {
    const k = key(state, city);
    if (payingKey) return; // guard double clicks across all cards

    // Never charge twice for the same location.
    if (unlocked.has(k)) {
      toast.info(`You already own access to ${city}, ${state} — opening it now.`);
      await openStateAndView(state, city);
      return;
    }

    setPayingKey(k);
    try {
      // Re-check server-side in case another tab/session already paid.
      const fresh = await loadUnlocked();
      if (fresh.has(k)) {
        toast.info(`You already own access to ${city}, ${state} — opening it now.`);
        setDirectoryToken((t) => t + 1);
        await openStateAndView(state, city);
        return;
      }

      const callback = `${window.location.origin}/placements`;
      const { data, error } = await supabase.functions.invoke("paystack-init", {
        body: { state, city, callback_url: callback },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.already_paid) {
        toast.info(`You already own access to ${city}, ${state} — opening it now.`);
        await loadUnlocked();
        setDirectoryToken((t) => t + 1);
        await openStateAndView(state, city);
      } else if (data?.authorization_url) {
        window.location.href = data.authorization_url;
        return; // keep the button disabled through the redirect
      } else {
        throw new Error("No authorization URL returned");
      }
    } catch (e: any) {
      toast.error(e.message || "Could not start payment");
    } finally {
      setPayingKey(null);
    }
  };

  const cs = citySearch.trim().toLowerCase();
  const visibleCities = cs ? cities.filter(c => c.city.toLowerCase().includes(cs)) : cities;
  const qs = companySearch.trim().toLowerCase();
  const visibleCompanies = qs
    ? companies.filter(c =>
        `${c.name} ${c.city ?? ""} ${c.business_district ?? ""} ${c.address}`.toLowerCase().includes(qs),
      )
    : companies;


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
        <div className="mb-10">
          <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
            Placements
          </div>
          <h1 className="text-4xl md:text-5xl font-display text-ink mb-3">Find your placement</h1>
          <p className="text-muted-foreground max-w-2xl">
            Pick a state and a city relevant to your department. Unlock a city for ₦3,000 to
            reveal every company's full details.
          </p>
        </div>

        {verifying && (
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Verifying payment…
          </div>
        )}

        {/* Selection breadcrumb */}
        {(selectedState || viewingCity) && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Viewing:</span>
            {selectedState && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink text-primary-foreground font-medium">
                <MapPin className="h-3.5 w-3.5" /> {selectedState}
              </span>
            )}
            {viewingCity && (
              <>
                <span className="text-muted-foreground">›</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground font-medium">
                  {viewingCity.city}
                </span>
              </>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* States — left */}
          <Card className="lg:col-span-1 h-fit lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-[0.15em] text-muted-foreground">
                States ({states.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {states.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No placements matched your department yet. Make sure your profile has a
                  department set.
                </p>
              )}
              {states.map((s) => (
                <button
                  key={s.state}
                  onClick={() => openState(s.state)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
                    selectedState === s.state
                      ? "bg-ink text-primary-foreground border-ink shadow-sm"
                      : "hover:bg-muted border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 font-medium truncate">
                      <MapPin className="h-4 w-4 shrink-0" /> {s.state}
                    </span>
                    <Badge
                      variant={selectedState === s.state ? "secondary" : "outline"}
                      className="shrink-0"
                    >
                      {s.placement_count}
                    </Badge>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Cities + companies — right */}
          <div className="lg:col-span-2 space-y-6">
            {!selectedState && (
              <Card>
                <CardContent className="py-20 text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-3 opacity-40" />
                  Select a state from the left to see cities you can unlock.
                </CardContent>
              </Card>
            )}

            {selectedState && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-display">
                    Cities in <span className="text-primary">{selectedState}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-3">
                  {cities.map((c) => {
                    const isUnlocked = unlocked.has(key(selectedState, c.city));
                    const isViewing = viewingCity?.state === selectedState && viewingCity?.city === c.city;
                    const k = key(selectedState, c.city);
                    return (
                      <div
                        key={c.city}
                        className={`p-4 rounded-lg border bg-card flex flex-col gap-3 transition-all ${
                          isViewing ? "border-primary ring-2 ring-primary/20" : ""
                        }`}
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
                            variant={isViewing ? "default" : "secondary"}
                            onClick={() => viewCompanies(selectedState, c.city)}
                          >
                            {isViewing ? "Viewing" : "View companies"}
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => pay(selectedState, c.city)}
                            disabled={!!payingKey}
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
                    <p className="text-sm text-muted-foreground col-span-full py-6 text-center">
                      No cities available for your department here.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {viewingCity && (
              <Card ref={companiesRef} className="ring-2 ring-primary/30 scroll-mt-28">
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

        <section className="mt-16">
          <div className="mb-6">
            <div className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Directory</div>
            <h2 className="font-display text-2xl md:text-3xl text-ink">All eligible companies</h2>
          </div>
          <CompanyDirectory refreshToken={directoryToken} />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Placements;
