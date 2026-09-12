import { Component, type ErrorInfo } from 'react';
import { Card } from '@/components/Card';
import { ActionButton } from '@/components/ActionButton';
import { logEvent } from '@/services/appLog';
import { LogCategory, LogLevel } from '@shared/logEntry';
import { ERROR_BOUNDARY_STRINGS } from '@/strings/errorBoundary.strings';
import type { ErrorBoundaryProps, ErrorBoundaryState } from '@/components/ErrorBoundary/ErrorBoundary.types';

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logEvent(LogCategory.APP, LogLevel.ERROR, error.message, `${error.stack ?? ''}\n${info.componentStack ?? ''}`);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="h-screen flex items-center justify-center p-4">
        <Card className="max-w-sm">
          <p className="font-bold text-body-sm-alt mb-1.5">{ERROR_BOUNDARY_STRINGS.title}</p>
          <p className="text-text-dim text-xs mb-3.5">{ERROR_BOUNDARY_STRINGS.description}</p>
          <ActionButton variant="primary" onClick={() => window.location.reload()}>
            {ERROR_BOUNDARY_STRINGS.reloadButton}
          </ActionButton>
        </Card>
      </div>
    );
  }
}
