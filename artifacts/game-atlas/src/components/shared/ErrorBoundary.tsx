import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[GameAtlas] Unhandled error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 mx-auto border-2 border-red-800 rounded-full flex items-center justify-center">
                <span className="font-orbitron text-3xl text-red-600">!</span>
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-red-900/10 blur-xl" />
            </div>
            <div className="space-y-2">
              <h2 className="font-orbitron text-2xl font-black text-white tracking-widest uppercase">
                System Error
              </h2>
              <p className="font-rajdhani text-gray-400 uppercase tracking-wider text-sm">
                An unexpected error occurred in the Nexus
              </p>
            </div>
            {this.state.error && (
              <div className="bg-white/3 border border-red-900/30 rounded-xl p-4 text-left">
                <p className="font-mono text-xs text-red-400 break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/dashboard";
              }}
              className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-orbitron font-bold tracking-widest text-sm rounded shadow-[0_0_20px_rgba(139,0,0,0.4)] transition-all uppercase"
            >
              Return to Base
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function PageErrorFallback({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center p-8">
      <div className="w-12 h-12 border border-red-800 rounded-xl flex items-center justify-center">
        <span className="font-orbitron text-red-600 text-lg">!</span>
      </div>
      <p className="font-orbitron text-white text-sm tracking-widest uppercase">
        {message ?? "Failed to load this section"}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="font-rajdhani text-xs text-red-500 hover:text-red-400 uppercase tracking-wider font-bold transition-colors"
      >
        Retry →
      </button>
    </div>
  );
}
