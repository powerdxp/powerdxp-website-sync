"use client";

// ==============================
// 🔧 Imports
// ==============================
import { useState } from "react";
import { ProductBulkActions } from "@/components/product-table/ProductBulkActions";
import { ProductRow } from "@/components/product-table/ProductRow";
import { ProductFilterRow } from "@/components/product-table/ProductFilterRow";

// ==============================
// 🧾 Type Definitions
// ==============================
type MatchType = "contains" | "startsWith" | "equals";

type Product = {
  status: string;
  image: string;
  sku: string;
  title: string;
  brand: string;
  distributor: string;
  cost: number;
  map: number;
  quantity: number;
  upc: string;
  asin: string;
  description: string;
  lastUpdated: string;
};

// ==============================
// 🧾 Static Product Data
// ==============================
const initialProducts: Product[] = [
  {
    status: "Synced",
    image: "/placeholder.png",
    sku: "123456",
    title: "Carbon Fiber Arrow",
    brand: "CarbonPro",
    distributor: "Kinsey's",
    cost: 12.99,
    map: 15.99,
    quantity: 44,
    upc: "123456789012",
    asin: "B00ABC1234",
    description: "Durable carbon fiber arrow for hunting and archery.",
    lastUpdated: "2025-03-20",
  },
];

// ==============================
// 📦 Main Component
// ==============================
export function ProductTable() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");

  const [titleFilter, setTitleFilter] = useState("");
  const [titleMatchType, setTitleMatchType] = useState<MatchType>("contains");

  const [skuFilter, setSkuFilter] = useState("");
  const [skuMatchType, setSkuMatchType] = useState<MatchType>("startsWith");

  const [brandFilter, setBrandFilter] = useState("");
  const [brandMatchType, setBrandMatchType] = useState<MatchType>("startsWith");

  const [distributorFilter, setDistributorFilter] = useState("");
  const [distributorMatchType, setDistributorMatchType] = useState<MatchType>("startsWith");

  const [upcFilter, setUpcFilter] = useState("");
  const [upcMatchType, setUpcMatchType] = useState<MatchType>("startsWith");

  const [asinFilter, setAsinFilter] = useState("");
  const [asinMatchType, setAsinMatchType] = useState<MatchType>("startsWith");

  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [descriptionMatchType, setDescriptionMatchType] = useState<MatchType>("contains");

  const [imageFilter, setImageFilter] = useState("All");

  const [costFrom, setCostFrom] = useState("");
  const [costTo, setCostTo] = useState("");

  const [mapFrom, setMapFrom] = useState("");
  const [mapTo, setMapTo] = useState("");

  const [quantityFrom, setQuantityFrom] = useState("");
  const [quantityTo, setQuantityTo] = useState("");

  const [sortField, setSortField] = useState<keyof Product>("title");
  const [sortAsc, setSortAsc] = useState(true);

  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);

  const clearAllFilters = () => {
    setSearch("");

    setTitleFilter("");
    setTitleMatchType("contains");

    setSkuFilter("");
    setSkuMatchType("startsWith");

    setBrandFilter("");
    setBrandMatchType("startsWith");

    setDistributorFilter("");
    setDistributorMatchType("startsWith");

    setUpcFilter("");
    setUpcMatchType("startsWith");

    setAsinFilter("");
    setAsinMatchType("startsWith");

    setDescriptionFilter("");
    setDescriptionMatchType("contains");

    setImageFilter("All");

    setCostFrom("");
    setCostTo("");

    setMapFrom("");
    setMapTo("");

    setQuantityFrom("");
    setQuantityTo("");
  };

  const toggleSort = (field: keyof Product) => {
    if (field === sortField) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filtered = products
    .filter((p) => {
      const valueMatch = (field: string, value: string, type: MatchType) => {
        const f = field.toLowerCase();
        const v = value.toLowerCase();
        return type === "contains" ? f.includes(v)
          : type === "startsWith" ? f.startsWith(v)
          : f === v;
      };

      return (
        (!titleFilter || valueMatch(p.title, titleFilter, titleMatchType)) &&
        (!skuFilter || valueMatch(p.sku, skuFilter, skuMatchType)) &&
        (!brandFilter || valueMatch(p.brand, brandFilter, brandMatchType)) &&
        (!distributorFilter || valueMatch(p.distributor, distributorFilter, distributorMatchType)) &&
        (!upcFilter || valueMatch(p.upc, upcFilter, upcMatchType)) &&
        (!asinFilter || valueMatch(p.asin, asinFilter, asinMatchType)) &&
        (!descriptionFilter || valueMatch(p.description, descriptionFilter, descriptionMatchType)) &&
        (imageFilter === "All" ||
          (imageFilter === "HasImage" && p.image.trim()) ||
          (imageFilter === "NoImage" && !p.image.trim())) &&
        (!costFrom || p.cost >= parseFloat(costFrom)) &&
        (!costTo || p.cost <= parseFloat(costTo)) &&
        (!mapFrom || p.map >= parseFloat(mapFrom)) &&
        (!mapTo || p.map <= parseFloat(mapTo)) &&
        (!quantityFrom || p.quantity >= parseInt(quantityFrom)) &&
        (!quantityTo || p.quantity <= parseInt(quantityTo)) &&
        (
          p.sku.includes(search) ||
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase())
        )
      );
    })
    .sort((a, b) => {
      const direction = sortAsc ? 1 : -1;
      if (a[sortField] < b[sortField]) return -1 * direction;
      if (a[sortField] > b[sortField]) return 1 * direction;
      return 0;
    });

  const allSelected = filtered.length > 0 && filtered.every((p) => selectedSkus.includes(p.sku));

  const toggleSelectAll = () => {
    setSelectedSkus(allSelected ? [] : filtered.map((p) => p.sku));
  };

  const toggleRowSelect = (sku: string) => {
    setSelectedSkus((prev) =>
      prev.includes(sku) ? prev.filter((s) => s !== sku) : [...prev, sku]
    );
  };

  const handleBulkDelete = () => {
    const remaining = products.filter((p) => !selectedSkus.includes(p.sku));
    setProducts(remaining);
    setSelectedSkus([]);
  };

  const handleBulkExport = () => {
    const selected = products.filter((p) => selectedSkus.includes(p.sku));
    const csv = [
      Object.keys(selected[0]).join(","),
      ...selected.map((p) => Object.values(p).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected-products.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectFiltered = () => {
    const filteredSkus = filtered.map((p) => p.sku);
    setSelectedSkus(filteredSkus);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 w-full">
      <div className="bg-yellow-100 text-yellow-800 text-center py-2 mb-4 font-bold rounded">
        ✅ This message confirms you're editing the live ProductTable
      </div>

      {/* 🔍 Global Search + Clear Filters */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Quick Search (SKU, Title, Brand)"
          className="border px-3 py-2 rounded w-64 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={clearAllFilters}
          className="text-xs px-3 py-2 border border-gray-300 rounded bg-white hover:bg-gray-100 transition"
        >
          🔄 Clear All Filters
        </button>
      </div>

      {selectedSkus.length > 0 && (
        <ProductBulkActions
          selectedCount={selectedSkus.length}
          onSelectFiltered={handleSelectFiltered}
          onDelete={handleBulkDelete}
          onExport={handleBulkExport}
        />
      )}

      <div className="overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full text-sm text-left mt-4 border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-20 shadow-sm border-b border-gray-200">
              <tr>
                <th className="p-3">
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                </th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3 font-medium">Image</th>
                <th className="p-3 font-medium cursor-pointer" onClick={() => toggleSort("sku")}>SKU</th>
                <th className="p-3 font-medium cursor-pointer" onClick={() => toggleSort("title")}>Title</th>
                <th className="p-3 font-medium">Brand</th>
                <th className="p-3 font-medium">Distributor</th>
                <th className="p-3 font-medium cursor-pointer" onClick={() => toggleSort("cost")}>Cost</th>
                <th className="p-3 font-medium cursor-pointer" onClick={() => toggleSort("map")}>MAP</th>
                <th className="p-3 font-medium cursor-pointer" onClick={() => toggleSort("quantity")}>Qty</th>
                <th className="p-3 font-medium">UPC</th>
                <th className="p-3 font-medium">ASIN</th>
                <th className="p-3 font-medium">Description</th>
                <th className="p-3 font-medium cursor-pointer" onClick={() => toggleSort("lastUpdated")}>Last Updated</th>
              </tr>

              <ProductFilterRow
                skuFilter={skuFilter}
                setSkuFilter={setSkuFilter}
                skuMatchType={skuMatchType}
                setSkuMatchType={setSkuMatchType}
                titleFilter={titleFilter}
                setTitleFilter={setTitleFilter}
                titleMatchType={titleMatchType}
                setTitleMatchType={setTitleMatchType}
                brandFilter={brandFilter}
                setBrandFilter={setBrandFilter}
                brandMatchType={brandMatchType}
                setBrandMatchType={setBrandMatchType}
                distributorFilter={distributorFilter}
                setDistributorFilter={setDistributorFilter}
                distributorMatchType={distributorMatchType}
                setDistributorMatchType={setDistributorMatchType}
                upcFilter={upcFilter}
                setUpcFilter={setUpcFilter}
                upcMatchType={upcMatchType}
                setUpcMatchType={setUpcMatchType}
                asinFilter={asinFilter}
                setAsinFilter={setAsinFilter}
                asinMatchType={asinMatchType}
                setAsinMatchType={setAsinMatchType}
                descriptionFilter={descriptionFilter}
                setDescriptionFilter={setDescriptionFilter}
                descriptionMatchType={descriptionMatchType}
                setDescriptionMatchType={setDescriptionMatchType}
                imageFilter={imageFilter}
                setImageFilter={setImageFilter}
                costFrom={costFrom}
                setCostFrom={setCostFrom}
                costTo={costTo}
                setCostTo={setCostTo}
                mapFrom={mapFrom}
                setMapFrom={setMapFrom}
                mapTo={mapTo}
                setMapTo={setMapTo}
                quantityFrom={quantityFrom}
                setQuantityFrom={setQuantityFrom}
                quantityTo={quantityTo}
                setQuantityTo={setQuantityTo}
              />
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product) => (
                <ProductRow
                  key={product.sku}
                  product={product}
                  isSelected={selectedSkus.includes(product.sku)}
                  onToggle={() => toggleRowSelect(product.sku)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
