import Header from './components/Header';
import Hero from './components/Hero';
import Agenda from './components/Agenda';
import PlanSection from './components/plan/PlanSection';
import Bottles from './components/Bottles';
import Access from './components/Access';
import Footer from './components/Footer';
import BookingDrawer from './components/booking/BookingDrawer';
import CursorLayer from './components/CursorLayer';
import Grain from './components/Grain';
import Flash from './components/Flash';
import Toast from './components/Toast';
import Marquee from './components/ui/Marquee';
import { VenueProvider } from './state/VenueContext';
import { CursorProvider } from './state/CursorContext';

export default function App() {
  return (
    <CursorProvider>
      <VenueProvider>
        <Grain />
        <CursorLayer />
        <Flash />

        <a
          href="#plan"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[900] focus:bg-infra focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.2em] focus:text-white"
        >
          Aller au plan de réservation
        </a>

        <Header />

        <main>
          <Hero />

          <div className="border-y border-white/10 bg-carbon py-3">
            <Marquee
              text="OUVERTURE 23:30 • DRESS CODE CHIC • RÉSERVATION OBLIGATOIRE • SERVICE MAGNUM • CARRÉ DJ VIP • "
              speed={38}
              spanClassName="font-mono text-[10px] uppercase tracking-[0.32em] text-steel"
            />
          </div>

          <Agenda />
          <PlanSection />
          <Bottles />
          <Access />
        </main>

        <Footer />
        <BookingDrawer />
        <Toast />
      </VenueProvider>
    </CursorProvider>
  );
}
