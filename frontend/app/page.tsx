"use client";

import { useMemo, useState, useEffect } from "react";
import useSWR from "swr";
import type { GameListItem, Paginated } from "@/lib/api";
import { formatCurrency } from "@/lib/api";
import GameCard from "@/components/GameCard";

type SortKey = "" | "price_asc" | "price_desc" | "discount" | "newest";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "", label: "Terbaru" },
  { value: "price_asc", label: "Harga Terendah" },
  { value: "price_desc", label: "Harga Tertinggi" },
  { value: "discount", label: "Diskon Terbesar" },
  { value: "newest", label: "Terbaru" },
];

const PLATFORM_FILTERS = [
  { value: "", label: "Semua", icon: "" },
  { value: "Steam", label: "Steam", icon: "fa-brands fa-steam" },
  { value: "Epic Games", label: "Epic Games", icon: "fa-solid fa-gamepad" },
  { value: "GOG", label: "GOG", icon: "fa-solid fa-globe" },
];

const GENRE_CARDS = [
  { name: "Action", color: "from-red-900/60 to-red-950/80", icon: "fa-solid fa-fire" },
  { name: "RPG", color: "from-cyan-900/60 to-cyan-950/80", icon: "fa-solid fa-dragon" },
  { name: "Adventure", color: "from-purple-900/60 to-purple-950/80", icon: "fa-solid fa-compass" },
  { name: "Strategy", color: "from-amber-900/60 to-amber-950/80", icon: "fa-solid fa-chess" },
  { name: "Indie", color: "from-violet-900/60 to-violet-950/80", icon: "fa-solid fa-paintbrush" },
];

// Opsi filter diskon "at least" (minimal)
const DISCOUNT_OPTIONS = [25, 50, 75, 90, 100];

// Daftar genre untuk sidebar filter
const GENRE_OPTIONS = [
  "Action",
  "RPG",
  "Adventure",
  "Strategy",
  "Indie",
  "Simulation",
  "Sports",
  "Racing",
  "Shooter",
  "Puzzle",
];

// Batas price range slider (dalam USD, sesuai data harga backend)
const PRICE_MIN = 0;
const PRICE_MAX = 100;

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [genre, setGenre] = useState("");
  const [sort, setSort] = useState<SortKey>("discount");
  const [minDiscount, setMinDiscount] = useState<number | "">("");
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);

  // Read search from URL query params (e.g. /?search=elden)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearch(searchParam);
      setDebouncedSearch(searchParam);
    }
  }, []);

  // Debounce input pencarian (300ms) agar tidak spam request ke API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Debounce slider harga (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 350);
    return () => clearTimeout(timer);
  }, [priceRange]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("per_page", "18");
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (platform) params.set("platform", platform);
    if (genre) params.append("genre[]", genre);
    if (minDiscount) params.set("min_discount", String(minDiscount));
    if (debouncedPriceRange[0] > PRICE_MIN) params.set("min_price", String(debouncedPriceRange[0]));
    if (debouncedPriceRange[1] < PRICE_MAX) params.set("max_price", String(debouncedPriceRange[1]));
    if (sort) params.set("sort", sort);
    return `/games?${params.toString()}`;
  }, [debouncedSearch, platform, genre, minDiscount, debouncedPriceRange, sort]);

  const { data, error, isLoading } = useSWR<Paginated<GameListItem>>(query);

  const results = data?.data ?? [];
  const featuredGame = results[0];
  const isSearching = debouncedSearch.length > 0;

  // Apakah ada filter aktif (selain sort)?
  const hasActiveFilters =
    Boolean(platform) ||
    Boolean(genre) ||
    Boolean(minDiscount) ||
    priceRange[0] > PRICE_MIN ||
    priceRange[1] < PRICE_MAX;

  const resetFilters = () => {
    setPlatform("");
    setGenre("");
    setMinDiscount("");
    setPriceRange([PRICE_MIN, PRICE_MAX]);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section - Full Width Background (disembunyikan saat mencari) */}
      {featuredGame && !isSearching && (
        <section className="relative -mx-4 -mt-6 mb-12 min-h-[700px] overflow-hidden sm:-mx-6 lg:-mx-8">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={featuredGame.screenshots?.[0] || ""}
              alt={featuredGame.title}
              className="h-full w-full animate-slow-zoom object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-transparent to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative mx-auto flex min-h-[700px] max-w-7xl items-end px-4 pb-16 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-6">
              <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-[#a3e635]/30 bg-black/40 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#a3e635] backdrop-blur">
                <i className="fa-solid fa-gamepad"></i>
                <span>GAME HUB / DISCOVER</span>
              </div>

              <h1 className="animate-fade-in-up animation-delay-100 text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
                Main lebih banyak.
                <br />
                <span className="text-[#a3e635]">Bayar lebih cerdas.</span>
              </h1>

              <p className="animate-fade-in-up animation-delay-200 text-lg leading-relaxed text-slate-300">
                Temukan game, bandingkan harga, dan temukan promo terbaik dalam satu tempat.
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
                <div className="animate-fade-in-up animation-delay-300 flex items-start gap-3 rounded-xl border border-slate-800/50 bg-black/40 p-4 backdrop-blur transition-all hover:scale-105 hover:border-[#a3e635]/50 hover:shadow-lg hover:shadow-[#a3e635]/20">
                  <div className="flex h-10 w-10 flex-shrink-0 animate-pulse-slow items-center justify-center rounded-lg bg-[#a3e635]/20">
                    <i className="fa-solid fa-shield-halved text-lg text-[#a3e635]"></i>
                  </div>
                  <div>
                    <p className="font-bold text-white">Harga Terbaik</p>
                    <p className="text-xs text-slate-400">Bandingkan antar platform</p>
                  </div>
                </div>

                <div className="animate-fade-in-up animation-delay-400 flex items-start gap-3 rounded-xl border border-slate-800/50 bg-black/40 p-4 backdrop-blur transition-all hover:scale-105 hover:border-[#a3e635]/50 hover:shadow-lg hover:shadow-[#a3e635]/20">
                  <div className="flex h-10 w-10 flex-shrink-0 animate-pulse-slow items-center justify-center rounded-lg bg-[#a3e635]/20">
                    <i className="fa-solid fa-bolt text-lg text-[#a3e635]"></i>
                  </div>
                  <div>
                    <p className="font-bold text-white">Promo Terbaru</p>
                    <p className="text-xs text-slate-400">Update setiap hari</p>
                  </div>
                </div>

                <div className="animate-fade-in-up animation-delay-500 flex items-start gap-3 rounded-xl border border-slate-800/50 bg-black/40 p-4 backdrop-blur transition-all hover:scale-105 hover:border-[#a3e635]/50 hover:shadow-lg hover:shadow-[#a3e635]/20">
                  <div className="flex h-10 w-10 flex-shrink-0 animate-pulse-slow items-center justify-center rounded-lg bg-[#a3e635]/20">
                    <i className="fa-solid fa-heart text-lg text-[#a3e635]"></i>
                  </div>
                  <div>
                    <p className="font-bold text-white">Wishlist</p>
                    <p className="text-xs text-slate-400">Simpan game favoritmu</p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="animate-fade-in-up animation-delay-600 flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#promo"
                  className="inline-flex transform items-center justify-center gap-2 rounded-xl bg-[#a3e635] px-8 py-4 text-base font-bold text-black shadow-lg shadow-[#a3e635]/20 transition hover:scale-105 hover:bg-[#bef264] active:scale-95"
                >
                  <span>Jelajahi Katalog</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </a>
                <a
                  href="#promo"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-700/80 bg-black/40 px-8 py-4 text-base font-semibold text-white backdrop-blur transition hover:scale-105 hover:bg-slate-800/40"
                >
                  Lihat Promo
                </a>
              </div>

              {/* Featured Game Info */}
              <div className="animate-fade-in-up animation-delay-700 flex items-center gap-4 rounded-xl border border-slate-800/50 bg-black/40 p-4 backdrop-blur">
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Featured Game</p>
                  <p className="text-xl font-bold text-white">{featuredGame.title}</p>
                </div>
                {featuredGame.lowest_price && (
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-[#a3e635]">
                      {formatCurrency(featuredGame.lowest_price, featuredGame.lowest_price_currency)}
                    </p>
                    {featuredGame.lowest_price_discounted && (
                      <span className="inline-block rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                        -{featuredGame.lowest_price_discount_percentage ?? 0}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sedang Diskon Section */}
      <section className="space-y-5" id="promo">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              <i className="fa-solid fa-fire text-xl text-amber-500"></i>
              <h2 className="font-extrabold uppercase tracking-wide">
                {debouncedSearch ? "Hasil Pencarian" : "Sedang Diskon"}
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
              {debouncedSearch
                ? `Menampilkan hasil untuk “${debouncedSearch}”`
                : "Game dengan harga terbaik minggu ini"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Urutkan:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-800 bg-[#121622] px-3 py-1.5 text-slate-200 outline-none transition hover:bg-slate-800 focus:border-[#a3e635] focus:ring-1 focus:ring-[#a3e635]"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari game berdasarkan judul..."
            aria-label="Cari game"
            className="w-full rounded-xl border border-slate-800 bg-[#121622] py-3 pl-10 pr-10 text-sm text-slate-200 placeholder-slate-500 transition duration-200 hover:bg-[#161c2b] focus:border-[#a3e635] focus:bg-[#161c2b] focus:outline-none focus:ring-1 focus:ring-[#a3e635]"
          />
          {search && (
            <button
              type="button"
              aria-label="Bersihkan pencarian"
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 transition hover:text-white"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Layout: Sidebar Filter + Hasil */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* === Sidebar Filter === */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-slate-800 bg-[#10141e] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-white">
                  <i className="fa-solid fa-sliders text-[#a3e635]"></i>
                  <span>Filter</span>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-semibold text-slate-400 transition hover:text-[#a3e635]"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Platform Shop */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Platform
                </p>
                <div className="space-y-1">
                  {PLATFORM_FILTERS.map((filter) => (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setPlatform(filter.value)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                        platform === filter.value
                          ? "bg-[#a3e635]/15 font-bold text-[#a3e635] ring-1 ring-[#a3e635]/40"
                          : "text-slate-300 hover:bg-slate-800/60"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {filter.icon && <i className={`${filter.icon} w-4`}></i>}
                        <span>{filter.label}</span>
                      </span>
                      {platform === filter.value && (
                        <i className="fa-solid fa-check text-xs"></i>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="my-4 border-slate-800" />

              {/* Discount at least */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Diskon Minimal
                </p>
                <div className="flex flex-wrap gap-2">
                  {DISCOUNT_OPTIONS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setMinDiscount((current) => (current === value ? "" : value))
                      }
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        minDiscount === value
                          ? "bg-[#a3e635] font-bold text-black"
                          : "border border-slate-800 bg-[#121622] text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {value}%+
                    </button>
                  ))}
                </div>
              </div>

              <hr className="my-4 border-slate-800" />

              {/* Genre */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Genre
                </p>
                <div className="flex flex-wrap gap-2">
                  {GENRE_OPTIONS.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() =>
                        setGenre((current) => (current === name ? "" : name))
                      }
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        genre === name
                          ? "bg-[#a3e635] font-bold text-black"
                          : "border border-slate-800 bg-[#121622] text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="my-4 border-slate-800" />

              {/* Price Range Slider */}
              <PriceRangeFilter
                value={priceRange}
                onChange={setPriceRange}
                min={PRICE_MIN}
                max={PRICE_MAX}
              />
            </div>
          </aside>

          {/* === Hasil === */}
          <div className="space-y-5">

        {/* Game Grid - 6 columns */}
        {isLoading && <p className="text-slate-400">Memuat game…</p>}
        {error && (
          <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">
            Gagal memuat data. Silakan cek koneksi ke server backend atau coba lagi.
          </div>
        )}
        {!isLoading && !error && results.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-[#10141e] p-8 text-center">
            <i className="fa-solid fa-magnifying-glass mb-3 text-3xl text-slate-600"></i>
            <p className="text-lg text-white">Game tidak ditemukan</p>
            <p className="mt-1 text-sm text-slate-400">
              {debouncedSearch
                ? `Tidak ada game yang cocok dengan “${debouncedSearch}”.`
                : "Coba ubah filter atau kata kunci."}
            </p>
            {(debouncedSearch || hasActiveFilters) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  resetFilters();
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#a3e635] px-4 py-2 text-sm font-bold text-black transition hover:bg-[#bef264]"
              >
                <i className="fa-solid fa-rotate-left"></i>
                Reset semua filter
              </button>
            )}
          </div>
        )}
        {!isLoading && !error && results.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {results.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
          </div>
        </div>
      </section>

      {/* Browse by Genre Section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              <i className="fa-solid fa-gamepad text-xl text-[#a3e635]"></i>
              <h2 className="font-extrabold uppercase tracking-wide">Browse Your Way</h2>
            </div>
            <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">Jelajahi berdasarkan genre</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {GENRE_CARDS.map((genreCard, idx) => (
            <button
              key={genreCard.name}
              type="button"
              onClick={() => {
                setGenre((current) => current === genreCard.name ? "" : genreCard.name);
                setSearch("");
                document.getElementById("promo")?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{ animationDelay: `${idx * 0.1}s` }}
              className={`group relative h-32 animate-fade-in-up overflow-hidden rounded-2xl border transition-all hover:scale-105 hover:border-[#a3e635]/50 hover:shadow-lg hover:shadow-[#a3e635]/20 ${
                genre === genreCard.name ? "border-[#a3e635] ring-2 ring-[#a3e635]/30" : "border-slate-800/90"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${genreCard.color} transition-all group-hover:opacity-80`}></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <i className={`${genreCard.icon} text-3xl text-white/80 transition-all group-hover:scale-125 group-hover:text-[#a3e635]`}></i>
                <p className="text-lg font-extrabold tracking-wide text-white">{genreCard.name}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Dual-thumb price range slider + input numerik.
 * Menggunakan dua <input type="range"> yang di-overlay.
 */
function PriceRangeFilter({
  value,
  onChange,
  min,
  max,
}: {
  value: [number, number];
  onChange: (range: [number, number]) => void;
  min: number;
  max: number;
}) {
  const [lo, hi] = value;
  const span = max - min || 1;
  const leftPct = ((lo - min) / span) * 100;
  const rightPct = 100 - ((hi - min) / span) * 100;

  const handleLo = (raw: number) => {
    const next = Math.min(Math.max(raw, min), hi - 1);
    onChange([next, hi]);
  };

  const handleHi = (raw: number) => {
    const next = Math.max(Math.min(raw, max), lo + 1);
    onChange([lo, next]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Rentang Harga
        </p>
        <span className="text-xs font-semibold text-[#a3e635]">
          ${lo} – ${hi}
        </span>
      </div>

      {/* Dual range slider */}
      <div className="relative h-5">
        <div className="absolute top-2 h-1 w-full rounded-full bg-[#232d42]"></div>
        <div
          className="absolute top-2 h-1 rounded-full bg-[#a3e635]"
          style={{ left: `${leftPct}%`, right: `${rightPct}%` }}
        ></div>
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={lo}
          aria-label="Harga minimum"
          onChange={(e) => handleLo(Number(e.target.value))}
          className="range-slider"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={hi}
          aria-label="Harga maksimum"
          onChange={(e) => handleHi(Number(e.target.value))}
          className="range-slider"
        />
      </div>

      {/* Numeric inputs */}
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-[10px] uppercase text-slate-500">Min</label>
          <input
            type="number"
            min={min}
            max={max}
            value={lo}
            onChange={(e) => handleLo(Number(e.target.value) || min)}
            className="w-full rounded-lg border border-slate-800 bg-[#121622] px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-[#a3e635] focus:ring-1 focus:ring-[#a3e635]"
          />
        </div>
        <span className="pb-2.5 text-slate-600">–</span>
        <div className="flex-1">
          <label className="mb-1 block text-[10px] uppercase text-slate-500">Maks</label>
          <input
            type="number"
            min={min}
            max={max}
            value={hi}
            onChange={(e) => handleHi(Number(e.target.value) || max)}
            className="w-full rounded-lg border border-slate-800 bg-[#121622] px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-[#a3e635] focus:ring-1 focus:ring-[#a3e635]"
          />
        </div>
      </div>
    </div>
  );
}
