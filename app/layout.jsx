import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Toast from '@/components/Toast';

export const metadata = {
  title: 'Festivault - Event and Festival Management Database System',
  description:
    'Discover upcoming music concerts, comedy fests, cultural carnivals, and manage festival bookings seamlessly with our modern light-themed event database system.',
  keywords: [
    'Event management',
    'Festival management',
    'Concerts',
    'Ticket booking',
    'Next.js event portal'
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <AppProvider>
          <Navbar />
          <main className="flex-1 min-h-[calc(100vh-160px)]">
            {children}
          </main>
          <Footer />
          <Toast />
        </AppProvider>
      </body>
    </html>
  );
}
