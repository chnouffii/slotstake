import { useState } from 'react';
import { useVenue } from '../state/VenueContext';
import MagneticButton from './ui/MagneticButton';
import Marquee from './ui/Marquee';

export default function Footer() {
  const { resetDemo } = useVenue();
  const [legal, setLegal] = useState(false);

  return (
    <footer className="relative border-t border-white/10 pt-16">
      <Marquee
        text="RÉSERVE 1862 • PRIVATE CLUB • STRASBOURG • "
        speed={40}
        spanClassName="display text-[13vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(229,231,235,0.14)]"
        className="pb-10"
      />

      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8 border-t border-white/10 py-10">
          <div>
            <p className="tag-red">Réservation</p>
            <p className="display mt-3 text-[30px] leading-none text-chrome sm:text-[42px]">UNE TABLE VOUS ATTEND</p>
          </div>
          <MagneticButton href="#plan" variant="solid" cursorLabel="OUVRIR LE PLAN">
            Ouvrir le plan
          </MagneticButton>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 border-t border-white/10 py-6">
          <p className="tag">© {new Date().getFullYear()} Réserve 1862 — Strasbourg</p>
          <nav className="flex flex-wrap items-center gap-6" aria-label="Liens légaux">
            <button type="button" onClick={() => setLegal((v) => !v)} className="tag transition-colors hover:text-chrome">
              Mentions légales
            </button>
            <a href="#acces" className="tag transition-colors hover:text-chrome">Confidentialité</a>
            <button type="button" onClick={resetDemo} className="tag transition-colors hover:text-infra">
              Réinitialiser la démo
            </button>
          </nav>
        </div>

        {legal && (
          <p className="max-w-5xl border-t border-white/10 py-6 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-ash">
            Réserve 1862 — établissement de nuit, Strasbourg. Site vitrine et module de réservation à usage de
            démonstration : les demandes envoyées depuis le plan sont conservées uniquement dans votre navigateur et
            ne sont transmises à aucun serveur. Téléphone, e-mail, adresse, capacités, minimums de consommation et
            prix affichés sont des valeurs d’exemple, à remplacer par les informations officielles de
            l’établissement. Vente d’alcool interdite aux mineurs. L’abus d’alcool est dangereux pour la santé, à
            consommer avec modération.
          </p>
        )}
      </div>
    </footer>
  );
}
