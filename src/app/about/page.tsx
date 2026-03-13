import { Metadata } from 'next';
import { AboutContent } from '@/components/AboutContent';

export const metadata: Metadata = {
  title: 'About the Bureau',
  description: 'Operational mandate and archival protocols for documenting unexplained phenomena in the Appalachian region.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
