import React from 'react';
import Marquee from 'react-fast-marquee';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * ScrollingTicker Component
 * Professional card-based scrolling ticker for live detection examples
 * Cards aligned in straight horizontal row like brand logos
 * @param {array} messages - Array of message objects {text, sentiment, confidence}
 * @param {number} speed - Scroll speed (default: 30)
 */
const ScrollingTicker = ({ messages = [], speed = 30 }) => {
  return (
    <div className="w-full overflow-hidden py-4">
      <Marquee
        speed={speed}
        gradient={true}
        gradientColor="#0A0A0B"
        gradientWidth={80}
        pauseOnHover={false}
        direction="left"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className="mx-3 bg-bg-secondary/60 backdrop-blur-sm border border-border-default rounded-20 p-6 w-[380px] h-[160px] flex flex-col justify-between shadow-glass hover:border-accent-primary/40 hover:shadow-glass-elevated transition-all duration-300"
          >
            {/* Header with Icon and Sentiment */}
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-10 ${
                msg.sentiment === 'Stressed' 
                  ? 'bg-danger/10' 
                  : 'bg-success/10'
              }`}>
                {msg.sentiment === 'Stressed' ? (
                  <TrendingDown className="w-4 h-4 text-danger" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-success" />
                )}
                <span className={`font-bold text-xs uppercase tracking-wider ${
                  msg.sentiment === 'Stressed' ? 'text-danger' : 'text-success'
                }`}>
                  {msg.sentiment}
                </span>
              </div>
              
              <span className="text-white font-bold text-lg">
                {msg.confidence}%
              </span>
            </div>

            {/* Message Text */}
            <div className="flex-1 flex items-center">
              <p className="text-text-primary text-sm leading-relaxed italic line-clamp-2">
                "{msg.text}"
              </p>
            </div>

            {/* Footer - Confidence Label */}
            <div className="flex justify-end">
              <span className="text-text-tertiary text-xs uppercase tracking-wide">
                Confidence
              </span>
            </div>
          </div>
        ))}
      </Marquee>
    </div>
  );
};

export default ScrollingTicker;
