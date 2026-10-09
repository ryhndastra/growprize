import { motion } from 'motion/react';
import { WHEEL_SEGMENTS } from '../hooks/useLuckyWheel';

interface AnimatedWheelVisualProps {
  rotation: number;
  isSpinning: boolean;
}

export function AnimatedWheelVisual({ rotation, isSpinning }: AnimatedWheelVisualProps) {
  const numSegments = WHEEL_SEGMENTS.length;
  const anglePerSegment = 360 / numSegments;

  return (
    <div className="relative flex flex-col items-center justify-center my-4">
      {/* jarum penunjuk di posisi paling atas (12 o'clock) */}
      <motion.div
        animate={isSpinning ? { rotate: [-8, 8, -6, 6, 0] } : { rotate: 0 }}
        transition={isSpinning ? { duration: 0.15, repeat: Infinity } : { duration: 0.2 }}
        className="absolute -top-3 z-20 flex flex-col items-center filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)]"
      >
        <div className="h-0 w-0 border-x-[14px] border-x-transparent border-t-[24px] border-t-amber-400" />
        <div className="h-2 w-2 rounded-full bg-red-600 ring-2 ring-white -mt-1" />
      </motion.div>

      {/* bingkai lingkaran luar roda dengan border emas berkilau */}
      <div className="relative flex h-[min(72vw,16rem)] w-[min(72vw,16rem)] sm:h-[19rem] sm:w-[19rem] items-center justify-center rounded-full border-4 border-amber-400 bg-sky-950 p-2 shadow-[0_12px_28px_rgba(0,0,0,0.45),inset_0_4px_8px_rgba(255,255,255,0.4)]">
        {/* roda yang berputar */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4.5, ease: [0.15, 0.9, 0.2, 1] }}
          className="relative h-full w-full rounded-full overflow-hidden shadow-inner"
        >
          <svg viewBox="0 0 100 100" className="h-full w-full">
            {WHEEL_SEGMENTS.map((seg, idx) => {
              const startAngle = idx * anglePerSegment;
              const endAngle = startAngle + anglePerSegment;
              const x1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
              const y1 = 50 - 50 * Math.cos((Math.PI * startAngle) / 180);
              const x2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);
              const y2 = 50 - 50 * Math.cos((Math.PI * endAngle) / 180);

              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
              const midAngle = startAngle + anglePerSegment / 2;
              const textRadius = 34;
              const tx = 50 + textRadius * Math.sin((Math.PI * midAngle) / 180);
              const ty = 50 - textRadius * Math.cos((Math.PI * midAngle) / 180);

              return (
                <g key={seg.id}>
                  <path d={pathData} fill={seg.color} stroke="#ffffff" strokeWidth="0.8" />
                  <text
                    x={tx}
                    y={ty}
                    fill={seg.textColor}
                    fontSize="4.2"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${midAngle}, ${tx}, ${ty})`}
                    className="select-none font-display"
                  >
                    {seg.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* pasak emas di sekeliling roda */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            return (
              <span
                key={i}
                style={{
                  transform: `rotate(${angle}deg) translateY(-48%)`,
                }}
                className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-amber-300 border border-amber-500 shadow-xs"
              />
            );
          })}
        </motion.div>

        {/* poros tengah roda dengan logo Growprize */}
        <div className="absolute z-10 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 p-1 shadow-[0_4px_8px_rgba(0,0,0,0.5)] border-2 border-white">
          <img
            src="/intro/growprize_logo.png"
            alt="Growprize"
            className="h-8 w-auto object-contain drop-shadow"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}

