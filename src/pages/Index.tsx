import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { BoardPreview } from '@/components/BoardPreview';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <BoardPreview />
      </main>
    </div>
  );
};

export default Index;
