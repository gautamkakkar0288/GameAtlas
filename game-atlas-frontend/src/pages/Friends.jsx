import React, { useEffect, useMemo, useState } from "react";
import { Users, Plus, Check, Wifi } from "lucide-react";
import toast from "react-hot-toast";
import { friendsService } from "../services/friendsService";

const MOCK_ACTIVITY = [
  "Playing Elden Ring",
  "In Valorant lobby",
  "Browsing GameAtlas store",
  "Playing GTA V Online",
  "Exploring open world",
  "Idle in launcher",
];

const statusFromId = (id) => (id % 3 !== 0 ? "online" : "offline");
const activityFromId = (id) => MOCK_ACTIVITY[id % MOCK_ACTIVITY.length];

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [friendIdInput, setFriendIdInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyRequestId, setBusyRequestId] = useState(null);

  const loadFriends = async () => {
    try {
      setLoading(true);
      const { data } = await friendsService.getFriends();
      setFriends(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to load friends");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFriends();
    const saved = localStorage.getItem("pending-friend-requests");
    if (saved) {
      try {
        setRequests(JSON.parse(saved));
      } catch {
        setRequests([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pending-friend-requests", JSON.stringify(requests));
  }, [requests]);

  const sendFriendRequest = async (e) => {
    e.preventDefault();
    const friendId = Number(friendIdInput);
    if (!Number.isFinite(friendId) || friendId <= 0) {
      toast.error("Enter a valid numeric Friend ID");
      return;
    }
    try {
      const { data } = await friendsService.sendRequest(friendId);
      setRequests((prev) => [
        ...prev,
        {
          id: data?.id || Date.now(),
          friendId,
          status: data?.status || "pending",
          createdAt: new Date().toISOString(),
        },
      ]);
      setFriendIdInput("");
      toast.success("Friend request sent");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to send request");
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      setBusyRequestId(requestId);
      await friendsService.acceptRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      toast.success("Friend request accepted");
      loadFriends();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to accept request");
    } finally {
      setBusyRequestId(null);
    }
  };

  const enrichedFriends = useMemo(
    () =>
      friends.map((entry) => {
        const f = entry.friend || {};
        const fid = f.id || entry.friendId || entry.id;
        return {
          ...entry,
          friend: f,
          presence: statusFromId(fid || 1),
          activity: activityFromId(fid || 1),
        };
      }),
    [friends]
  );

  return (
    <div className="page-wrap">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "28px" }}>
        <div>
          <h2 className="page-title" style={{ margin: 0 }}>Friends</h2>
          <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
            Track your squad, online status, and what everyone is playing.
          </p>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: "24px" }}>
        <form onSubmit={sendFriendRequest} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <input
            value={friendIdInput}
            onChange={(e) => setFriendIdInput(e.target.value)}
            placeholder="Enter Friend ID (numeric)"
            className="form-input"
            style={{ minWidth: "240px", flex: 1 }}
          />
          <button type="submit" className="btn btn-primary">
            <Plus size={15} />
            Add Friend
          </button>
        </form>
      </div>

      <div className="games-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", marginBottom: "26px" }}>
        <div className="glass-card" style={{ padding: "20px" }}>
          <h3 style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <Users size={18} />
            Friend Requests
          </h3>
          {requests.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>No pending requests</p>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {requests.map((req) => (
                <div key={req.id} style={{ border: "1px solid var(--border)", borderRadius: "10px", padding: "10px 12px", background: "rgba(255,255,255,0.03)" }}>
                  <p style={{ fontWeight: 600 }}>Request #{req.id}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "13px", marginTop: "2px" }}>Friend ID: {req.friendId}</p>
                  <div style={{ marginTop: "8px" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={busyRequestId === req.id}
                      onClick={() => acceptRequest(req.id)}
                    >
                      <Check size={14} />
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card" style={{ padding: "20px" }}>
          <h3 style={{ marginBottom: "14px" }}>Stats</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "8px" }}>
            Total friends: <span style={{ color: "var(--text)", fontWeight: 700 }}>{enrichedFriends.length}</span>
          </p>
          <p style={{ color: "var(--text-muted)" }}>
            Online now:{" "}
            <span style={{ color: "#34D399", fontWeight: 700 }}>
              {enrichedFriends.filter((f) => f.presence === "online").length}
            </span>
          </p>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: "14px" }}>Friend List</h3>
        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading friends...</p>
        ) : enrichedFriends.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>No accepted friends yet. Send your first request above.</p>
        ) : (
          <div style={{ display: "grid", gap: "10px" }}>
            {enrichedFriends.map((entry) => {
              const f = entry.friend || {};
              return (
                <div
                  key={entry.id}
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "12px 14px",
                    background: "rgba(255,255,255,0.03)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 700 }}>{f.name || f.email || `Friend #${entry.friendId}`}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{f.email || "No email available"}</p>
                    <p style={{ color: "#A78BFA", fontSize: "13px", marginTop: "4px" }}>{entry.activity}</p>
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      border: `1px solid ${entry.presence === "online" ? "rgba(16,185,129,0.5)" : "rgba(148,163,184,0.4)"}`,
                      background: entry.presence === "online" ? "rgba(16,185,129,0.12)" : "rgba(148,163,184,0.12)",
                      color: entry.presence === "online" ? "#34D399" : "#94A3B8",
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    <Wifi size={13} />
                    {entry.presence}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;

