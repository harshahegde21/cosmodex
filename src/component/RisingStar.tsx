import { useState, useEffect } from 'react';

interface RisingStarsProps {
  size?: number;
  width?: number;
  height?: number;
}

export default function RisingStars({
  size = 1024,
  width = 3840,
  height = 3840
}: RisingStarsProps) {
  const [stars, setStars] = useState<{ small: string; medium: string; large: string } | null>(null);

  useEffect(() => {
    const random = (max: number) => Math.floor(Math.random() * max);

    const generateStars = (count: number) => {
      return Array.from({ length: count }, () => {
        // Need two copies of each star exactly `height` apart for seamless scrolling
        return `${random(width)}px ${random(height)}px #FFF, ${random(width)}px ${random(height) + height}px #FFF`;
      }).join(',');
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStars({
      small: generateStars(size),
      medium: generateStars(Math.floor(size / 2)),
      large: generateStars(Math.floor(size / 4)),
    });
  }, [size, width, height]);

  if (!stars) {
    return <div className="absolute inset-0 overflow-hidden w-screen h-[45vh] bg-gradient-to-b from-20% to-80% pointer-events-none z-0" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden w-screen h-[45vh] bg-gradient-to-b from-20% to-80% pointer-events-none z-0">
      <div
        className="rising-stars__small animate-risingstar [animation-duration:333s] w-px h-px bg-transparent absolute"
        style={{ boxShadow: stars.small }}
      />
      <div
        className="rising-stars__medium animate-risingstar [animation-duration:666s] w-[2px] h-[2px] bg-transparent absolute"
        style={{ boxShadow: stars.medium }}
      />
      <div
        className="rising-stars__large animate-risingstar [animation-duration:999s] w-[3px] h-[3px] bg-transparent absolute"
        style={{ boxShadow: stars.large }}
      />
    </div>
  );
}