"use client"

import { useMemo, useState } from "react"
import { ArrowUpDown, LayoutGrid, SearchX, Wallet, X } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Destination } from "@/lib/destinations"
import { formatTaka } from "@/lib/format"
import { cn } from "@/lib/utils"
import DestinationCard from "./destination-card"

// Rounds to a "nice" number (1, 2 or 5 x 10^n) so bucket labels look clean
function niceStep(value: number) {
  if (value <= 0) return 1
  const pow = 10 ** Math.floor(Math.log10(value))
  const n = value / pow
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * pow
}

// Price buckets are built from your real prices, so they fit any scale
function buildPriceRanges(prices: number[]) {
  const step = niceStep(Math.max(...prices, 0) / 4)
  return [
    { value: "all", label: "Any price", test: (_p: number) => true },
    { value: "b1", label: `Under ${formatTaka(step)}`, test: (p: number) => p < step },
    { value: "b2", label: `${formatTaka(step)} – ${formatTaka(step * 2)}`, test: (p: number) => p >= step && p < step * 2 },
    { value: "b3", label: `${formatTaka(step * 2)} – ${formatTaka(step * 3)}`, test: (p: number) => p >= step * 2 && p < step * 3 },
    { value: "b4", label: `${formatTaka(step * 3)} +`, test: (p: number) => p >= step * 3 },
  ]
}

const collator = new Intl.Collator("en", {
  sensitivity: "base",
  numeric: true,
})

// compare by title (trimmed), fall back to id so equal titles keep a stable order
const byTitle = (a: Destination, b: Destination) =>
  collator.compare(a.title.trim(), b.title.trim()) ||
  collator.compare(a.id, b.id)

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
]

// One reusable labelled filter: icon tile + small label + current value
function FilterSelect({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  active,
}: {
  label: string
  icon: LucideIcon
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  active: boolean
}) {
  // Render the human label ourselves so it never shows raw values like "all"
  const selectedLabel = options.find((o) => o.value === value)?.label ?? value

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        if (next !== null) onChange(next)
      }}
    >
      <SelectTrigger
        aria-label={label}
        className="group relative h-[76px] w-full justify-start gap-4 rounded-none border-0 bg-transparent px-6 shadow-none transition-colors duration-300 hover:bg-sky-50/70 focus-visible:bg-sky-50/70 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1a9fc0]/40 data-[size=default]:h-[76px] data-[size=sm]:h-[76px] data-[state=open]:bg-sky-50 data-[popup-open]:bg-sky-50 [&>svg:last-child]:ml-auto [&>svg:last-child]:size-4 [&>svg:last-child]:text-neutral-400 [&>svg:last-child]:transition-transform [&>svg:last-child]:duration-300 data-[state=open]:[&>svg:last-child]:rotate-180"
      >
        <span
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-xl transition-all duration-300 group-hover:scale-105",
            active
              ? "bg-[#1a9fc0] text-white shadow-md shadow-[#1a9fc0]/30"
              : "bg-[#1a9fc0]/10 text-[#1a9fc0]"
          )}
        >
          <Icon className="size-5" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col items-start text-left">
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
            {label}
          </span>
          <SelectValue className="line-clamp-1 text-sm font-semibold text-neutral-900">
            {selectedLabel}
          </SelectValue>
        </span>
        {/* underline shows when the filter is active */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-6 bottom-0 h-0.5 origin-left rounded-full bg-[#1a9fc0] transition-transform duration-500",
            active ? "scale-x-100" : "scale-x-0"
          )}
        />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function DestinationsExplorer({
  destinations,
}: {
  destinations: Destination[]
}) {
  const [category, setCategory] = useState("all")
  const [price, setPrice] = useState("all")
  const [sort, setSort] = useState("featured")

  const priceRanges = useMemo(
    () => buildPriceRanges(destinations.map((d) => d.price)),
    [destinations]
  )

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: "All categories" },
      ...Array.from(new Set(destinations.map((d) => d.category)))
        .sort()
        .map((c) => ({ value: c, label: c })),
    ],
    [destinations]
  )

  const filtersActive = category !== "all" || price !== "all" || sort !== "featured"

  const results = useMemo(() => {
    const range = priceRanges.find((r) => r.value === price) ?? priceRanges[0]
    const list = destinations.filter(
      (d) =>
        (category === "all" || d.category === category) && range.test(d.price)
    )
    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price)
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price)
      case "rating":
        return [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      case "name-asc":
        return [...list].sort(byTitle)
      case "name-desc":
        return [...list].sort((a, b) => byTitle(b, a))
      default:
        return list
    }
  }, [destinations, priceRanges, category, price, sort])

  const reset = () => {
    setCategory("all")
    setPrice("all")
    setSort("featured")
  }

  return (
    <>
      {/* Filter bar */}
      <div className="grid divide-y divide-neutral-100 overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/5 ring-1 ring-black/5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <FilterSelect
          label="Category"
          icon={LayoutGrid}
          value={category}
          onChange={setCategory}
          options={categoryOptions}
          active={category !== "all"}
        />
        <FilterSelect
          label="Price range"
          icon={Wallet}
          value={price}
          onChange={setPrice}
          options={priceRanges}
          active={price !== "all"}
        />
        <FilterSelect
          label="Sort by"
          icon={ArrowUpDown}
          value={sort}
          onChange={setSort}
          options={SORT_OPTIONS}
          active={sort !== "featured"}
        />
      </div>

      {/* Result count + reset */}
      <div className="mt-5 flex min-h-9 items-center justify-between">
        <p className="text-sm text-neutral-600" aria-live="polite">
          Showing{" "}
          <span className="font-semibold text-neutral-900">{results.length}</span>{" "}
          destination{results.length === 1 ? "" : "s"}
        </p>
        {filtersActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="gap-1.5 text-[#1a9fc0] hover:bg-[#1a9fc0]/10 hover:text-[#1a9fc0]"
          >
            <X className="size-3.5" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Grid */}
      {results.length > 0 ? (
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((d, i) => (
            // stable key: cards keep their loaded images when filters change
            <DestinationCard
              key={d.id}
              destination={d}
              priority={i < 3}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center rounded-3xl border border-dashed border-neutral-200 bg-white px-6 py-20 text-center">
          <div className="grid size-14 place-items-center rounded-2xl bg-[#1a9fc0]/10 text-[#1a9fc0]">
            <SearchX className="size-6" />
          </div>
          <h3 className="mt-5 text-xl font-medium text-neutral-900">
            No destinations match your filters
          </h3>
          <p className="mt-2 max-w-sm text-sm text-neutral-600">
            Try a different category or price range to see more travel
            experiences.
          </p>
          <Button onClick={reset} className="mt-6 bg-[#1a9fc0] hover:bg-[#168aa8]">
            Clear filters
          </Button>
        </div>
      )}
    </>
  )
}