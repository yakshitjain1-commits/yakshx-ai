
import React from 'react';

interface VeoApiKeyPromptProps {
    onSelectVeoApiKey: () => void;
}

const VeoApiKeyPrompt: React.FC<VeoApiKeyPromptProps> = ({ onSelectVeoApiKey }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-light-card dark:bg-dark-card rounded-lg shadow-md max-w-lg mx-auto animate-fadeIn">
        <h2 className="text-2xl font-bold mb-2">Video Generation Requires API Key</h2>
        <p className="mb-4 text-light-text-secondary dark:text-dark-text-secondary">
            To generate videos with Veo, you need to select a Google AI Studio API key for a project with billing enabled. For more details, see the{' '}
            <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-light-accent dark:text-dark-accent hover:underline">
                billing documentation
            </a>.
        </p>
        <button
            onClick={onSelectVeoApiKey}
            className="px-6 py-3 rounded-lg transition-colors duration-200 bg-light-accent text-white hover:bg-blue-600 dark:bg-dark-accent dark:hover:bg-blue-500 font-semibold"
        >
            Select API Key
        </button>
    </div>
);

export default VeoApiKeyPrompt;
