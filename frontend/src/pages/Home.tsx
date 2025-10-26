// src/pages/Home.tsx
export default function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center py-16">
      <h1 className="text-6xl font-bold text-gradient mb-6">
        Cross-Game Crafting Hub
      </h1>
      <p className="text-xl text-gray-300 mb-8">
        Combine NFTs from different games to craft legendary items in a decentralized metaverse.
      </p>
      <div className="flex justify-center gap-4">
        <a href="/inventory" className="btn-primary">
          Explore Inventory
        </a>
      </div>
    </div>
  );
}
