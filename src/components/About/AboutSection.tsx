import { useTranslation } from 'react-i18next';
import { useNavigation } from '../../context/NavigationContext';
import { Button } from '../ui/Button';

export function AboutSection() {
  const { t } = useTranslation();
  const { goHome } = useNavigation();

  return (
    <div className="about-section">
      <div className="about-container">
        <h1 className="about-title">{t('about.title')}</h1>

        <section className="about-block">
          <h2 className="about-heading">{t('about.intro.title')}</h2>
          <p className="about-text">{t('about.intro.description')}</p>
        </section>

        <section className="about-block">
          <h2 className="about-heading">{t('about.howToPlay.title')}</h2>
          <ol className="about-steps">
            {(t('about.howToPlay.steps', { returnObjects: true }) as string[]).map((step, i) => (
              <li key={i} className="about-step">
                <span className="about-step-num">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-block">
          <h2 className="about-heading">{t('about.battleTypes.title')}</h2>
          <div className="about-types-grid">
            {(['attack', 'defense', 'stamina', 'balance'] as const).map((type) => (
              <div key={type} className={`about-type-card about-type-${type}`}>
                <span className="about-type-icon">
                  {type === 'attack' ? '⚔️' : type === 'defense' ? '🛡️' : type === 'stamina' ? '🌀' : '⚖️'}
                </span>
                <h3 className="about-type-name">{t(`about.battleTypes.${type}.name`)}</h3>
                <p className="about-type-desc">{t(`about.battleTypes.${type}.desc`)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-block">
          <h2 className="about-heading">{t('about.acknowledgments.title')}</h2>
          <ul className="about-credits">
            <li>
              <strong>TAKARA TOMY</strong> — {t('about.acknowledgments.takaratomy')}
            </li>
            <li>
              <a href="https://beyblade.phstudy.org/" target="_blank" rel="noopener noreferrer">
                BEYBLADE X Viewer (beyblade.phstudy.org)
              </a>{' '}
              — {t('about.acknowledgments.phstudy')}
            </li>
            <li>
              <a href="https://freesound.org/" target="_blank" rel="noopener noreferrer">
                Freesound
              </a>{' '}
              — {t('about.acknowledgments.freesound')}
            </li>
            <li>
              <strong>TRAE IDE</strong> — {t('about.acknowledgments.trae')}
            </li>
          </ul>
        </section>

        <section className="about-block">
          <h2 className="about-heading">{t('about.contact.title')}</h2>
          <p className="about-text">{t('about.contact.maintainer')}</p>
          <ul className="about-contact-list">
            <li>
              📧{' '}
              <a href="mailto:francis.tse.mc@gmail.com">francis.tse.mc@gmail.com</a>
            </li>
            <li>
              💼{' '}
              <a href="https://www.linkedin.com/in/francis-tse-6a399a47/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
          </ul>
        </section>

        <div className="about-back">
          <Button onClick={goHome}>{t('about.back')}</Button>
        </div>
      </div>

      <style>{`
        .about-section {
          min-height: 100vh;
          padding: 80px 16px 40px;
          display: flex;
          justify-content: center;
        }

        .about-container {
          max-width: 680px;
          width: 100%;
        }

        .about-title {
          font-size: 2.5rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 2rem;
          line-height: 1.2;
          min-height: 3rem;
          background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .about-block {
          margin-bottom: 2rem;
        }

        .about-heading {
          font-size: 1.25rem;
          font-weight: 700;
          color: #10b981;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid rgba(16, 185, 129, 0.2);
        }

        .about-text {
          color: #4b5563;
          line-height: 1.75;
          font-size: 0.95rem;
        }

        .about-steps {
          list-style: none;
          padding: 0;
          margin: 0;
          counter-reset: none;
        }

        .about-step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
          color: #4b5563;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        .about-step-num {
          flex-shrink: 0;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #3b82f6);
          color: #fff;
          font-weight: 700;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .about-types-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        @media (max-width: 480px) {
          .about-types-grid {
            grid-template-columns: 1fr;
          }
        }

        .about-type-card {
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          transition: transform 0.2s ease;
        }

        .about-type-card:hover {
          transform: translateY(-2px);
        }

        .about-type-attack {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05));
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .about-type-defense {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.05));
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .about-type-stamina {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .about-type-balance {
          background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(168, 85, 247, 0.05));
          border: 1px solid rgba(168, 85, 247, 0.2);
        }

        .about-type-icon {
          font-size: 1.5rem;
          display: block;
          margin-bottom: 4px;
        }

        .about-type-name {
          font-weight: 700;
          font-size: 0.95rem;
          margin-bottom: 4px;
        }

        .about-type-attack .about-type-name { color: #ef4444; }
        .about-type-defense .about-type-name { color: #3b82f6; }
        .about-type-stamina .about-type-name { color: #10b981; }
        .about-type-balance .about-type-name { color: #a855f7; }

        .about-type-desc {
          font-size: 0.8rem;
          color: #6b7280;
          line-height: 1.5;
        }

        .about-credits {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .about-credits li {
          padding: 8px 0;
          color: #4b5563;
          font-size: 0.95rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          line-height: 1.6;
        }

        .about-credits li:last-child {
          border-bottom: none;
        }

        .about-credits a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
        }

        .about-credits a:hover {
          text-decoration: underline;
        }

        .about-contact-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .about-contact-list li {
          padding: 6px 0;
          font-size: 0.95rem;
        }

        .about-contact-list a {
          color: #3b82f6;
          text-decoration: none;
        }

        .about-contact-list a:hover {
          text-decoration: underline;
        }

        .about-back {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
}
