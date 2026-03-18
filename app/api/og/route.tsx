import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'TuAsesorDeModa';
  const kicker = searchParams.get('kicker') || 'Moda, estilo y belleza';
  const description =
    searchParams.get('description') ||
    'Descubre artículos y guías editoriales sobre moda, belleza y estilo.';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, #fffdf8 0%, #f8efe3 45%, #f3e6d7 100%)',
          color: '#2f241d',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at top left, rgba(210,128,57,0.18), transparent 34%)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            padding: '52px 64px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  border: '2px solid rgba(194,91,57,0.55)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c25b39',
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '18px',
                  fontWeight: 700,
                }}
              >
                T
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  lineHeight: 1,
                }}
              >
                <span
                  style={{
                    color: '#c25b39',
                    fontSize: '34px',
                    fontWeight: 700,
                  }}
                >
                  Tu Asesor
                </span>
                <span
                  style={{
                    color: '#c25b39',
                    fontSize: '34px',
                    fontWeight: 700,
                  }}
                >
                  de Moda
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                alignSelf: 'flex-start',
                border: '1px solid rgba(194,91,57,0.22)',
                borderRadius: '999px',
                padding: '8px 18px',
                color: '#9d5b43',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                fontFamily: 'Arial, sans-serif',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              {kicker}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                maxWidth: '920px',
              }}
            >
              <div
                style={{
                  fontSize: '68px',
                  lineHeight: 1.02,
                  color: '#3e2a22',
                  fontWeight: 700,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '30px',
                  lineHeight: 1.35,
                  color: '#5b6477',
                  maxWidth: '980px',
                }}
              >
                {description}
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#6c6f76',
                fontSize: '24px',
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '1px',
                  background: 'rgba(47,36,29,0.22)',
                }}
              />
              Editorial de moda, belleza y estilo
            </div>
            <div
              style={{
                color: '#9d5b43',
                fontSize: '24px',
                fontWeight: 700,
              }}
            >
              tuasesordemoda.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
