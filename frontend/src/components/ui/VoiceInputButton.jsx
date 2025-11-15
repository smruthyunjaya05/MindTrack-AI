import React, { useState, useEffect, useRef } from 'react';
import { Mic, Loader2 } from 'lucide-react';

/**
 * VoiceInputButton Component
 * Web Speech API integration for voice-to-text
 * @param {function} onTranscript - Callback with transcribed text
 * @param {boolean} disabled - Disabled state
 */
const VoiceInputButton = ({ onTranscript, disabled = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }
      
      if (finalTranscript && onTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      setIsProcessing(false);
      
      // Show user-friendly error message
      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (event.error === 'no-speech') {
        // Silent failure for no speech detected
      } else {
        alert('Voice input error. Please try again.');
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      setIsProcessing(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const toggleRecording = () => {
    if (!recognitionRef.current || disabled) return;

    if (isRecording) {
      // Stop recording
      setIsProcessing(true);
      recognitionRef.current.stop();
    } else {
      // Start recording
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start recording:', error);
      }
    }
  };

  if (!isSupported) {
    return null; // Hide button if not supported
  }

  return (
    <button
      onClick={toggleRecording}
      disabled={disabled || isProcessing}
      className={`
        absolute top-3 right-3 w-11 h-11 rounded-12 
        flex items-center justify-center cursor-pointer
        transition-all duration-300
        ${
          isRecording
            ? 'bg-gradient-primary border-2 border-accent-gold animate-pulse-glow'
            : isProcessing
            ? 'bg-info/30 border border-info cursor-not-allowed'
            : 'bg-bg-tertiary border border-border-default hover:bg-bg-elevated hover:border-accent-primary hover:scale-105'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
      aria-pressed={isRecording}
      title={
        isRecording
          ? 'Click to stop recording'
          : isProcessing
          ? 'Transcribing your speech...'
          : 'Click to start voice input'
      }
    >
      {isProcessing ? (
        <Loader2 size={20} className="text-info animate-spin" />
      ) : (
        <Mic
          size={20}
          className={isRecording ? 'text-white' : 'text-text-secondary'}
        />
      )}
    </button>
  );
};

export default VoiceInputButton;
