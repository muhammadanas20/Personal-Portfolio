import { motion, useReducedMotion } from "framer-motion";

export const Reveal = ({ children, delay = 0, y = 22, className = "" }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: reduce ? 0 : 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

export const SceneHead = ({ n, name, end }) => (
  <div className="zll-scene__head zll-mono zll-mono--xs">
    <span className="zll-scene__tag">
      <span className="zll-scene__tick" />
      SCENE {n} — <span className="zll-scene__name">{name}</span>
    </span>
    <span className="zll-scene__end">{end}</span>
  </div>
);

export const Frame = ({ src, alt, caption, note, ratio, className = "" }) => (
  <figure className={`zll-frame ${className}`} style={{ margin: 0 }}>
    <div className="zll-frame__inner" style={ratio ? { aspectRatio: ratio } : undefined}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
    <span className="zll-frame__tick zll-frame__tick--tl" />
    <span className="zll-frame__tick zll-frame__tick--tr" />
    <span className="zll-frame__tick zll-frame__tick--bl" />
    <span className="zll-frame__tick zll-frame__tick--br" />
    {(caption || note) && (
      <figcaption className="zll-caption zll-mono zll-mono--xs">
        <b>{caption}</b>
        <span>{note}</span>
      </figcaption>
    )}
  </figure>
);

export const Marquee = ({ items, speed = 44 }) => {
  const row = [...items, ...items];
  return (
    <div className="zll-marquee" aria-hidden="true">
      <div className="zll-marquee__track zll-mono zll-mono--xs" style={{ animationDuration: `${speed}s` }}>
        {row.map((item, i) => (
          <span className="zll-marquee__item" key={`${item}-${i}`}>
            <i>▚</i>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
