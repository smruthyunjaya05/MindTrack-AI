import React, { useEffect } from 'react';

const ChatbotWidget = () => {
  useEffect(() => {
    // Load Botpress webchat scripts
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v3.3/inject.js';
    document.head.appendChild(script1);
    
    const script2 = document.createElement('script');
    script2.src = 'https://files.bpcontent.cloud/2025/11/13/22/20251113222812-6MHWV20L.js';
    script2.defer = true;
    document.head.appendChild(script2);

    // Add minimal styling to reduce chat window size
    script2.onload = () => {
      const style = document.createElement('style');
      style.innerHTML = `
        .bpw-layout {
          width: 350px !important;
          height: 450px !important;
          max-height: 450px !important;
        }
      `;
      document.head.appendChild(style);
    };

    return () => {
      // Cleanup scripts on unmount
      if (document.head.contains(script1)) {
        document.head.removeChild(script1);
      }
      if (document.head.contains(script2)) {
        document.head.removeChild(script2);
      }
    };
  }, []);

  return null;
};

export default ChatbotWidget;
