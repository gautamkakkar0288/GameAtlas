import React from 'react';
import GameCard from '../GameCard';

const mockRecommended = [
    { id: 5, title: "Ghost of Tsushima", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80", platform: "Steam", originalPrice: 3999, price: 3999, discount: 0, rating: 4.8 },
    { id: 6, title: "Hades II", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80", platform: "Epic", originalPrice: 1200, price: 1200, discount: 0, rating: 4.9 },
    { id: 7, title: "Starfield", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=800&q=80", platform: "Steam", originalPrice: 4999, price: 2499, discount: 50, rating: 3.8 },
    { id: 8, title: "Baldur's Gate 3", image: "/images/baldur'sGate3.jpg", platform: "Steam", originalPrice: 2999, price: 2999, discount: 0, rating: 5.0 },
];

const Recommended = () => {
    return (
        <section className="py-16 px-6 md:px-16 lg:px-24 bg-gray-900 border-t border-gray-800">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                    Because you played <span className="text-blue-500 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Action RPGs</span>
                </h2>

                {/* Horizontal Scroll Container */}
                <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide">
                    {mockRecommended.map((game) => (
                        <div key={game.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                            <GameCard game={game} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Recommended;