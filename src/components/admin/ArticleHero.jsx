// src/components/ArticleHero.jsx
import React from 'react';

const ArticleHero = ({ heroType, heroImage, gradientColor1, gradientColor2, gradientAngle, heroWidth, heroAspect }) => {
  const effectiveWidth = heroAspect === 'square' ? heroWidth : heroWidth;

  return (
    <section className="article-hero-container">
      {heroType === 'image' && heroImage ? (
        <div
          className="w-full rounded-[12px] overflow-hidden"
          style={{
            width: `${effectiveWidth}px`,
            height: `${heroWidth}px`,
            maxWidth: '1280px',
            margin: '0 auto',
          }}
        >
          <img
            src={heroImage.src}
            alt="Article Hero"
            className="w-full h-full object-cover"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(14, 165, 233, 0.3))' }}
          />
        </div>
      ) : heroType === 'linear' ? (
        <div
          className="w-full rounded-[12px]"
          style={{
            width: `${effectiveWidth}px`,
            height: `${heroWidth}px`,
            maxWidth: '1280px',
            margin: '0 auto',
            background: `linear-gradient(${gradientAngle}deg, ${gradientColor1}, ${gradientColor2})`,
          }}
        />
      ) : (
        <div
          className="w-full h-[320px] bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-[12px]"
          style={{ maxWidth: '1280px', margin: '0 auto' }}
        />
      )}
    </section>
  );
};

export default ArticleHero;