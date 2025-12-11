import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SubjectSelector from '../components/SubjectSelector';
import CategoryPills from '../components/CategoryPills';
import GameGrid from '../components/GameGrid';
import { useLanguage } from '../context/LanguageContext';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// Import images from img folder
import elfImg from '../img/elf.jpg';
import bugattiImg from '../img/first_bugatti.jpg';
import lambaImg from '../img/lamba.jpg';
import santaImg from '../img/santa.jpg';
import snegurkaImg from '../img/snegurka.jpg';
import basketImg from '../img/basket.jpg';
import clapImg from '../img/clap.jpg';
import clap1Img from '../img/clap1.jpg';
import clap2Img from '../img/clap2.jpg';
import clap4Img from '../img/clap4.jpg';
import olenImg from '../img/olen.jpg';

const gameModes = [
  { id: 'dice-sum', label: 'Dice на сумму', icon: 'grid' },
  { id: 'dice-american', label: 'Dice американский', icon: 'grid' },
  { id: 'coinflip', label: 'Coinflip', icon: 'grid' },
  { id: 'blackjack', label: 'Blackjack', icon: 'cards' },
  { id: 'football', label: 'Football', icon: 'zap' },
  { id: 'nvuti', label: 'Nvuti', icon: 'star' }
];

const games = [
  { id: 1, title: 'Dice на сумму', provider: 'Pragmatic Play', tag: 'Drops & Wins', cover: 'sugar', subject: 'ТРПО', mode: 'dice-sum' },
  { id: 2, title: 'Blackjack', provider: 'Endorphina', cover: 'hell', subject: 'КПиЯП', mode: 'blackjack' },
  { id: 3, title: 'Football', provider: 'Pragmatic Play', cover: 'zeus', subject: 'ПСИИП', mode: 'football' },
  { id: 4, title: 'Nvuti', provider: 'Spribe', cover: 'astronaut', subject: 'ТРПО', mode: 'nvuti' },
  { id: 5, title: 'Dice американский', provider: 'Evoplay', tag: 'Bonus Game', cover: 'chicken', subject: 'КПиЯП', mode: 'dice-american' },
  { id: 6, title: 'Blackjack', provider: '3 Oaks Gaming', cover: 'coins', subject: 'ПСИИП', mode: 'blackjack' },
  { id: 7, title: 'Football', provider: 'Pragmatic Play', cover: 'olympus', subject: 'ТРПО', mode: 'football' },
  { id: 8, title: 'Nvuti', provider: 'Hacksaw', cover: 'king', subject: 'КПиЯП', mode: 'nvuti' },
  { id: 9, title: 'Dice на сумму', provider: 'Pragmatic Play', tag: 'Drops & Wins', cover: 'dog', subject: 'ПСИИП', mode: 'dice-sum' },
  { id: 10, title: 'Coinflip', provider: 'Spribe', cover: 'sugar', subject: 'ТРПО', mode: 'coinflip' }
];

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel images
  const carouselImages = [
    { src: elfImg, alt: 'Elf' },
    { src: bugattiImg, alt: 'Bugatti' },
    { src: lambaImg, alt: 'Lamborghini' },
    { src: santaImg, alt: 'Santa' },
    { src: snegurkaImg, alt: 'Snegurka' },
    { src: basketImg, alt: 'Basket' },
    { src: clapImg, alt: 'Clap' },
    { src: clap1Img, alt: 'Clap1' },
    { src: clap2Img, alt: 'Clap2' },
    { src: clap4Img, alt: 'Clap4' },
    { src: olenImg, alt: 'Olen' }
  ];

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const next = prev + 1;
      // Reset to beginning when reaching the end for infinite scroll
      return next >= carouselImages.length ? 0 : next;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const next = prev - 1;
      // Go to end when going before beginning for infinite scroll
      return next < 0 ? carouselImages.length - 1 : next;
    });
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const getAvailableModes = () => {
    if (!selectedSubject) return gameModes;
    const subjectGames = games.filter((game) => game.subject === selectedSubject);
    const availableModeIds = [...new Set(subjectGames.map((game) => game.mode))];
    return gameModes.filter((mode) => availableModeIds.includes(mode.id));
  };

  const getAvailableSubjects = () => {
    if (!selectedMode) return ['ТРПО', 'КПиЯП', 'ПСИИП'];
    const modeGames = games.filter((game) => game.mode === selectedMode);
    return [...new Set(modeGames.map((game) => game.subject))];
  };

  const handleSubjectSelect = (subject) => {
    if (selectedSubject === subject) {
      setSelectedSubject(null);
      return;
    }
    setSelectedSubject(subject);
    if (selectedMode) {
      const subjectGames = games.filter((game) => game.subject === subject);
      const availableModes = [...new Set(subjectGames.map((game) => game.mode))];
      if (!availableModes.includes(selectedMode)) {
        setSelectedMode(null);
      }
    }
  };

  const handleModeSelect = (mode) => {
    if (selectedMode === mode) {
      setSelectedMode(null);
      return;
    }
    setSelectedMode(mode);
    if (selectedSubject) {
      const modeGames = games.filter((game) => game.mode === mode);
      const availableSubjects = [...new Set(modeGames.map((game) => game.subject))];
      if (!availableSubjects.includes(selectedSubject)) {
        setSelectedSubject(null);
      }
    }
  };

  const handleModePageOpen = (modeId) => {
    navigate(`/game/${modeId}`);
  };

  const handleResetFilters = () => {
    setSelectedSubject(null);
    setSelectedMode(null);
  };

  const filteredGames = games.filter((game) => {
    if (selectedSubject && game.subject !== selectedSubject) return false;
    if (selectedMode && game.mode !== selectedMode) return false;
    return true;
  });

  const availableModes = getAvailableModes();
  const availableSubjects = getAvailableSubjects();


  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full">
      {/* Hero Carousel */}
      <div className="relative w-full">
        <div className="relative overflow-hidden px-3">
          {/* Slides Container */}
          <div
            className="flex transition-transform duration-700 ease-in-out gap-6"
            style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
          >
            {/* Duplicate slides for infinite scroll effect */}
            {[...carouselImages, ...carouselImages, ...carouselImages].map((image, index) => (
              <div key={index} className="flex-shrink-0 w-1/3 relative">
                <div className="relative overflow-hidden rounded-3xl h-64 shadow-lg group hover:scale-[1.02] transition-transform duration-300">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 via-transparent to-indigo-800/80"></div>
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="text-white">
                      <h3 className="text-xl font-bold mb-2">
                        {index % carouselImages.length === 0 && t('carousel1')}
                        {index % carouselImages.length === 1 && t('carousel2')}
                        {index % carouselImages.length === 2 && t('carousel3')}
                        {index % carouselImages.length === 3 && t('carousel4')}
                        {index % carouselImages.length === 4 && t('carousel5')}
                        {index % carouselImages.length === 5 && t('carousel6')}
                        {index % carouselImages.length === 6 && t('carousel7')}
                        {index % carouselImages.length === 7 && t('carousel8')}
                        {index % carouselImages.length === 8 && t('carousel9')}
                        {index % carouselImages.length === 9 && t('carousel10')}
                        {index % carouselImages.length === 10 && t('carousel11')}
                      </h3>
                      <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold transition-all">
                        {t('details')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full text-white transition-all duration-300 hover:scale-110 shadow-lg z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full text-white transition-all duration-300 hover:scale-110 shadow-lg z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-primary shadow-lg'
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-6">
        <SubjectSelector
          onSubjectSelect={handleSubjectSelect}
          selectedSubject={selectedSubject}
          availableSubjects={availableSubjects}
        />
        
        <CategoryPills
          modes={availableModes}
          onModeSelect={handleModeSelect}
          selectedMode={selectedMode}
          onModePageOpen={handleModePageOpen}
        />
      </div>

      {/* Game Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {t('popular')}
          </h2>
          <div className="flex gap-2">
            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <GameGrid
          games={filteredGames}
          onResetFilters={handleResetFilters}
          onModePageOpen={handleModePageOpen}
        />
      </div>
    </div>
  );
};

export default HomePage;

