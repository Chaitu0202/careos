// CareOS Hospital Operating System — Real-time Voice Conversation Interface
import React, { useState, useEffect, useRef } from 'react';
import { useHospital } from '../../state/hospitalStore';
import { Mic, MicOff, Volume2, X, Sparkles, Activity, AlertCircle } from 'lucide-react';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose }) => {
  const { executeCommand, isInvestigating, isSpeaking, stopSpeaking, currentInvestigation } = useHospital();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Suggested voice inquiries
  const voiceSuggestions = [
    'Why is P1001 delayed?',
    'Which department is causing the biggest delay today?',
    'How many patients are waiting in radiology and why?',
    'What should we do about it?',
    'Find available beds for a new ICU admission',
  ];

  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    // Initialize Web Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setVoiceError('Microphone access blocked. You can still test with the suggested voice commands below.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;

      try {
        recognition.start();
      } catch (err) {
        console.warn('Could not auto-start recognition:', err);
      }
    } else {
      setVoiceError('Web Speech API is not natively supported in this browser. Please use the quick voice prompts below.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartListening = () => {
    if (recognitionRef.current) {
      try {
        setTranscript('');
        recognitionRef.current.start();
      } catch (e) {
        // Recognition might already be running
      }
    }
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const handleDispatchVoice = (textToSend?: string) => {
    const text = (textToSend || transcript).trim();
    if (text) {
      executeCommand(text);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F6F9FC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172B4D]">CareOS Voice Command</h3>
              <p className="text-[11px] text-[#64748B]">Real-time hospital operating system conversation</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-1 rounded-md text-[#64748B] hover:text-[#172B4D] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Waveform / Visualizer */}
        <div className="p-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#F6F9FC] to-white border-b border-[#E2E8F0]">
          <div className="relative mb-4">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-[#2563EB] text-white shadow-[0_0_24px_rgba(37,99,235,0.4)] scale-105'
                  : 'bg-[#EAF2FF] text-[#2563EB] border border-[#2563EB]/30'
              }`}
            >
              <Mic className="w-8 h-8" />
            </div>

            {/* Pulsing rings */}
            {isListening && (
              <>
                <span className="absolute inset-0 rounded-full border-2 border-[#2563EB] animate-ping opacity-30" />
                <span className="absolute -inset-2 rounded-full border border-[#2563EB]/40 animate-pulse" />
              </>
            )}
          </div>

          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              {isListening ? 'LISTENING TO ADMINISTRATOR...' : 'MICROPHONE READY'}
            </div>
            <p className="text-xs text-[#64748B] mt-1 max-w-xs">
              {isListening
                ? 'Speak clearly into your microphone'
                : 'Click the button below or choose a suggested voice inquiry'}
            </p>
          </div>

          {/* Audio bars animation */}
          {isListening && (
            <div className="flex items-center gap-1 mt-4 h-6">
              {[40, 75, 55, 90, 60, 85, 45, 100, 70, 50].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#2563EB] rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Live Transcript Display */}
        <div className="p-4 bg-white">
          <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
            Voice Transcript
          </div>
          <div className="min-h-[60px] p-3 rounded-lg bg-[#F6F9FC] border border-[#E2E8F0] text-xs text-[#172B4D]">
            {transcript ? (
              <span className="font-medium text-[#172B4D]">{transcript}</span>
            ) : (
              <span className="text-[#64748B] italic">
                {isListening ? 'Listening for speech...' : 'Say a command or click an example below...'}
              </span>
            )}
          </div>

          {voiceError && (
            <div className="mt-2 p-2 rounded-md bg-[#FFF6E5] border border-[#D97706]/20 text-[11px] text-[#D97706] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{voiceError}</span>
            </div>
          )}

          {/* Suggested Voice Commands */}
          <div className="mt-3">
            <div className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">
              Suggested Voice Commands
            </div>
            <div className="space-y-1">
              {voiceSuggestions.map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleDispatchVoice(sug)}
                  className="w-full text-left px-2.5 py-1.5 rounded-md bg-[#F6F9FC] hover:bg-[#EAF2FF] border border-[#E2E8F0] hover:border-[#2563EB]/30 text-xs text-[#172B4D] hover:text-[#2563EB] transition-all flex items-center justify-between group"
                >
                  <span>"{sug}"</span>
                  <span className="text-[10px] text-[#2563EB] opacity-0 group-hover:opacity-100 font-semibold">
                    Dispatch →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-5 py-3 bg-[#F6F9FC] border-t border-[#E2E8F0] flex items-center justify-between">
          <button
            onClick={isListening ? handleStopListening : handleStartListening}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isListening
                ? 'bg-[#FEECEC] text-[#DC2626] border border-[#DC2626]/30'
                : 'bg-white text-[#172B4D] border border-[#E2E8F0] hover:bg-[#F6F9FC]'
            }`}
          >
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isListening ? 'Stop Listening' : 'Start Mic'}</span>
          </button>

          <button
            onClick={() => handleDispatchVoice()}
            disabled={!transcript.trim() || isInvestigating}
            className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold disabled:opacity-40 transition-colors shadow-xs"
          >
            Dispatch to Orchestrator
          </button>
        </div>
      </div>
    </div>
  );
};
