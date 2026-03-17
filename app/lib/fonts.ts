import localFont from 'next/font/local';

export const inter = localFont({
  src: [
    { path: '../fonts/Inter-400.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/Inter-500.ttf', weight: '500', style: 'normal' },
    { path: '../fonts/Inter-600.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/Inter-700.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-inter',
});

export const abrilFatface = localFont({
  src: '../fonts/AbrilFatface-LatinExt.woff2',
  variable: '--font-abril-fatface',
  weight: '400',
  style: 'normal',
});

export const ebGaramond = localFont({
  src: [
    { path: '../../fonts/EBGaramond-VariableFont_wght.ttf', weight: '400 800', style: 'normal' },
    { path: '../../fonts/EBGaramond-Italic-VariableFont_wght.ttf', weight: '400 800', style: 'italic' },
  ],
  variable: '--font-eb-garamond',
});

export const sourceSans3 = localFont({
  src: [
    { path: '../fonts/SourceSans3-400.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/SourceSans3-500.ttf', weight: '500', style: 'normal' },
    { path: '../fonts/SourceSans3-600.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/SourceSans3-700.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-source-sans-3',
});
