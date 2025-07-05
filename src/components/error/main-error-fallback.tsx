"use client";

interface MainErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export const MainErrorFallback: React.FC<MainErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
        <div className="text-red-600 mb-4">
          <svg
            className="w-12 h-12 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong
        </h2>

        <p className="text-gray-600 mb-4">
          An unexpected error occurred. Please try again.
        </p>

        <details className="text-left bg-gray-100 rounded p-3 mb-4 text-sm">
          <summary className="cursor-pointer font-medium text-gray-700 mb-2">
            Error details
          </summary>
          <pre className="text-red-600 whitespace-pre-wrap break-words">
            {error.message}
          </pre>
        </details>

        <button
          onClick={resetErrorBoundary}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
};
