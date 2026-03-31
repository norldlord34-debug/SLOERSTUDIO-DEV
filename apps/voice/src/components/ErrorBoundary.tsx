import React, { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

/**
 * Enterprise Error Boundary to prevent full app crashes in case of WebGL or render loop failures.
 */
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        void error;
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Enterprise ErrorBoundary caught an error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center" style={{ background: 'rgba(20,20,24,0.9)', borderRadius: '12px' }}>
                    <span className="text-[10px] text-red-400 font-bold mb-1">Visualizer Error</span>
                    <button
                        className="text-[9px] px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors"
                        onClick={() => this.setState({ hasError: false })}
                    >
                        Recover
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
