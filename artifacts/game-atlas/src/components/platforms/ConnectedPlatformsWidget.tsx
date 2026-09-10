import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SiSteam, SiEpicgames, SiPlaystation } from "react-icons/si";
import { RefreshCw, CheckCircle2, AlertCircle, Link2, ExternalLink, X, Plus, Gamepad2 } from "lucide-react";
import { platformsApi, type ConnectedAccount } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function ConnectedPlatformsWidget() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<"steam" | "epic" | "playstation" | "xbox">("steam");
  const [externalId, setExternalId] = useState("");
  const [displayName, setDisplayName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["connected-platforms"],
    queryFn: () => platformsApi.getAccounts(),
    staleTime: 30_000,
  });

  const syncMutation = useMutation({
    mutationFn: (provider: string) => platformsApi.sync(provider),
    onSuccess: (res) => {
      toast({
        title: `${res.result.provider.toUpperCase()} Synced!`,
        description: `Synced ${res.result.gamesSynced} titles (${res.result.matchedGameAtlasGames} matched in GameAtlas)`,
      });
      queryClient.invalidateQueries({ queryKey: ["connected-platforms"] });
      queryClient.invalidateQueries({ queryKey: ["library"] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    },
    onError: (err) => {
      toast({
        title: "Sync Failed",
        description: err instanceof Error ? err.message : "Sync error",
        variant: "destructive",
      });
    },
  });

  const connectMutation = useMutation({
    mutationFn: (body: { provider: string; externalUserId: string; displayName?: string }) =>
      platformsApi.connect(body),
    onSuccess: () => {
      toast({ title: "Account Connected", description: `Successfully linked ${selectedProvider.toUpperCase()}` });
      setConnectModalOpen(false);
      setExternalId("");
      setDisplayName("");
      queryClient.invalidateQueries({ queryKey: ["connected-platforms"] });
    },
    onError: (err) => {
      toast({
        title: "Connection Failed",
        description: err instanceof Error ? err.message : "Could not connect account",
        variant: "destructive",
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: (provider: string) => platformsApi.disconnect(provider),
    onSuccess: () => {
      toast({ title: "Disconnected", description: "Platform account removed" });
      queryClient.invalidateQueries({ queryKey: ["connected-platforms"] });
    },
  });

  const accounts = data?.accounts ?? [];

  const platformDefs = [
    { id: "steam", name: "Steam", icon: SiSteam, color: "#66c0f4", sampleId: "76561198000000000" },
    { id: "epic", name: "Epic Games", icon: SiEpicgames, color: "#ffffff", sampleId: "epic_account_nexus" },
    { id: "playstation", name: "PlayStation", icon: SiPlaystation, color: "#003791", sampleId: "PSN_NexusPlayer" },
    { id: "xbox", name: "Xbox Live", icon: Gamepad2, color: "#107c10", sampleId: "Xbox_NexusGamer" },
  ];

  return (
    <section className="glass-panel p-5 rounded-xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-orbitron text-lg font-bold tracking-widest text-white border-l-4 border-red-600 pl-3">
            CROSS-PLATFORM HUB
          </h3>
          <p className="font-rajdhani text-gray-400 text-xs uppercase tracking-wider pl-4">
            Steam • Epic • PlayStation • Xbox Canonical Sync
          </p>
        </div>
        <button
          onClick={() => setConnectModalOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-300 border border-red-500/30 font-rajdhani uppercase text-xs font-bold tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Plus size={14} /> Connect Platform
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse bg-white/5 h-20 rounded-lg" />
      ) : accounts.length === 0 ? (
        <div className="p-4 rounded-xl bg-white/3 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <Link2 size={20} />
            </div>
            <div>
              <p className="font-orbitron font-bold text-white text-xs">No gaming platforms connected yet</p>
              <p className="font-inter text-gray-400 text-xs">Link your Steam or Epic Games account to auto-sync playtime, achievements & recommendations.</p>
            </div>
          </div>
          <button
            onClick={() => setConnectModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-rajdhani uppercase text-xs font-bold tracking-widest rounded-lg transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] shrink-0 cursor-pointer"
          >
            Connect Steam
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {accounts.map((acc) => {
            const def = platformDefs.find((p) => p.id === acc.provider);
            const Icon = def?.icon || Link2;
            const isSyncing = syncMutation.isPending && syncMutation.variables === acc.provider;

            return (
              <div key={acc.id} className="p-3.5 rounded-xl bg-white/3 border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10"
                    style={{ backgroundColor: `${def?.color || "#fff"}15`, color: def?.color || "#fff" }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-orbitron font-bold text-white text-xs truncate">
                      {acc.displayName || acc.externalUserId}
                    </p>
                    <p className="font-rajdhani text-[11px] text-gray-400 uppercase tracking-wider">
                      {acc.provider} • {acc.lastSyncedAt ? `Synced ${new Date(acc.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "Connected"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => syncMutation.mutate(acc.provider)}
                    disabled={isSyncing}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                    title="Sync library & activity"
                  >
                    <RefreshCw size={14} className={isSyncing ? "animate-spin text-red-400" : ""} />
                  </button>
                  <button
                    onClick={() => disconnectMutation.mutate(acc.provider)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-950/40 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                    title="Disconnect"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Connect Modal */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0d0d0d] border border-red-900/40 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-orbitron text-lg font-bold text-white tracking-wider">CONNECT GAMING PLATFORM</h3>
              <button onClick={() => setConnectModalOpen(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {platformDefs.map((p) => {
                const Icon = p.icon;
                const active = selectedProvider === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProvider(p.id as any)}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      active
                        ? "bg-red-950/40 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <Icon size={20} style={{ color: p.color }} />
                    <span className="font-rajdhani font-bold text-white text-sm uppercase">{p.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-rajdhani text-xs uppercase tracking-wider text-gray-400 mb-1">
                  Account ID or Username
                </label>
                <input
                  type="text"
                  placeholder={platformDefs.find((p) => p.id === selectedProvider)?.sampleId}
                  value={externalId}
                  onChange={(e) => setExternalId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block font-rajdhani text-xs uppercase tracking-wider text-gray-400 mb-1">
                  Display Alias (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. My Steam Profile"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/10 text-white font-inter text-sm focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConnectModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 font-rajdhani uppercase font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!externalId.trim()) {
                    toast({ title: "Account ID Required", description: "Please provide an account ID or username", variant: "destructive" });
                    return;
                  }
                  connectMutation.mutate({
                    provider: selectedProvider,
                    externalUserId: externalId.trim(),
                    displayName: displayName.trim() || undefined,
                  });
                }}
                disabled={connectMutation.isPending}
                className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-orbitron font-bold text-xs tracking-wider transition-colors shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer"
              >
                {connectMutation.isPending ? "Connecting..." : "AUTHORIZE & SYNC"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
