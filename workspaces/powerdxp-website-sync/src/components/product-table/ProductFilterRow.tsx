"use client";

import React from "react";

type MatchType = "contains" | "startsWith" | "equals";

type ProductFilterRowProps = {
  skuFilter: string;
  setSkuFilter: (v: string) => void;
  skuMatchType: MatchType;
  setSkuMatchType: (v: MatchType) => void;

  titleFilter: string;
  setTitleFilter: (v: string) => void;
  titleMatchType: MatchType;
  setTitleMatchType: (v: MatchType) => void;

  brandFilter: string;
  setBrandFilter: (v: string) => void;
  brandMatchType: MatchType;
  setBrandMatchType: (v: MatchType) => void;

  distributorFilter: string;
  setDistributorFilter: (v: string) => void;
  distributorMatchType: MatchType;
  setDistributorMatchType: (v: MatchType) => void;

  upcFilter: string;
  setUpcFilter: (v: string) => void;
  upcMatchType: MatchType;
  setUpcMatchType: (v: MatchType) => void;

  asinFilter: string;
  setAsinFilter: (v: string) => void;
  asinMatchType: MatchType;
  setAsinMatchType: (v: MatchType) => void;

  descriptionFilter: string;
  setDescriptionFilter: (v: string) => void;
  descriptionMatchType: MatchType;
  setDescriptionMatchType: (v: MatchType) => void;

  imageFilter: string;
  setImageFilter: (v: string) => void;

  costFrom: string;
  setCostFrom: (v: string) => void;
  costTo: string;
  setCostTo: (v: string) => void;

  mapFrom: string;
  setMapFrom: (v: string) => void;
  mapTo: string;
  setMapTo: (v: string) => void;

  quantityFrom: string;
  setQuantityFrom: (v: string) => void;
  quantityTo: string;
  setQuantityTo: (v: string) => void;
};

export function ProductFilterRow({
  skuFilter,
  setSkuFilter,
  skuMatchType,
  setSkuMatchType,

  titleFilter,
  setTitleFilter,
  titleMatchType,
  setTitleMatchType,

  brandFilter,
  setBrandFilter,
  brandMatchType,
  setBrandMatchType,

  distributorFilter,
  setDistributorFilter,
  distributorMatchType,
  setDistributorMatchType,

  upcFilter,
  setUpcFilter,
  upcMatchType,
  setUpcMatchType,

  asinFilter,
  setAsinFilter,
  asinMatchType,
  setAsinMatchType,

  descriptionFilter,
  setDescriptionFilter,
  descriptionMatchType,
  setDescriptionMatchType,

  imageFilter,
  setImageFilter,

  costFrom,
  setCostFrom,
  costTo,
  setCostTo,

  mapFrom,
  setMapFrom,
  mapTo,
  setMapTo,

  quantityFrom,
  setQuantityFrom,
  quantityTo,
  setQuantityTo,
}: ProductFilterRowProps) {
  return (
    <tr className="bg-white text-xs">
      <th className="p-2"></th>
      <th className="p-2"></th>

      {/* Image Filter */}
      <th className="p-2">
        <select
          value={imageFilter}
          onChange={(e) => setImageFilter(e.target.value)}
          className="border px-2 py-1 rounded text-xs w-full"
        >
          <option value="All">All</option>
          <option value="HasImage">Has Image</option>
          <option value="NoImage">No Image</option>
        </select>
      </th>

      {/* SKU Filter */}
      <th className="p-2">
        <div className="flex flex-col gap-1">
          <select
            value={skuMatchType}
            onChange={(e) => setSkuMatchType(e.target.value as MatchType)}
            className="border px-1 py-1 rounded text-xs w-full"
          >
            <option value="startsWith">Starts With</option>
            <option value="equals">Equals</option>
            <option value="contains">Contains</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="border px-2 py-1 rounded text-xs w-full"
            value={skuFilter}
            onChange={(e) => setSkuFilter(e.target.value)}
          />
        </div>
      </th>

      {/* Title Filter */}
      <th className="p-2">
        <div className="flex flex-col gap-1">
          <select
            value={titleMatchType}
            onChange={(e) => setTitleMatchType(e.target.value as MatchType)}
            className="border px-1 py-1 rounded text-xs w-full"
          >
            <option value="contains">Contains</option>
            <option value="startsWith">Starts With</option>
            <option value="equals">Equals</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="border px-2 py-1 rounded text-xs w-full"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          />
        </div>
      </th>

      {/* Brand Filter */}
      <th className="p-2">
        <div className="flex flex-col gap-1">
          <select
            value={brandMatchType}
            onChange={(e) => setBrandMatchType(e.target.value as MatchType)}
            className="border px-1 py-1 rounded text-xs w-full"
          >
            <option value="startsWith">Starts With</option>
            <option value="equals">Equals</option>
            <option value="contains">Contains</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="border px-2 py-1 rounded text-xs w-full"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          />
        </div>
      </th>

      {/* Distributor Filter */}
      <th className="p-2">
        <div className="flex flex-col gap-1">
          <select
            value={distributorMatchType}
            onChange={(e) => setDistributorMatchType(e.target.value as MatchType)}
            className="border px-1 py-1 rounded text-xs w-full"
          >
            <option value="startsWith">Starts With</option>
            <option value="equals">Equals</option>
            <option value="contains">Contains</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="border px-2 py-1 rounded text-xs w-full"
            value={distributorFilter}
            onChange={(e) => setDistributorFilter(e.target.value)}
          />
        </div>
      </th>

      {/* Cost Filter */}
      <th className="p-2">
        <div className="flex gap-1">
          <input
            type="number"
            placeholder="From"
            value={costFrom}
            onChange={(e) => setCostFrom(e.target.value)}
            className="border px-2 py-1 rounded text-xs w-1/2"
          />
          <input
            type="number"
            placeholder="To"
            value={costTo}
            onChange={(e) => setCostTo(e.target.value)}
            className="border px-2 py-1 rounded text-xs w-1/2"
          />
        </div>
      </th>

      {/* MAP Filter */}
      <th className="p-2">
        <div className="flex gap-1">
          <input
            type="number"
            placeholder="From"
            value={mapFrom}
            onChange={(e) => setMapFrom(e.target.value)}
            className="border px-2 py-1 rounded text-xs w-1/2"
          />
          <input
            type="number"
            placeholder="To"
            value={mapTo}
            onChange={(e) => setMapTo(e.target.value)}
            className="border px-2 py-1 rounded text-xs w-1/2"
          />
        </div>
      </th>

      {/* Quantity Filter */}
      <th className="p-2">
        <div className="flex gap-1">
          <input
            type="number"
            placeholder="From"
            value={quantityFrom}
            onChange={(e) => setQuantityFrom(e.target.value)}
            className="border px-2 py-1 rounded text-xs w-1/2"
          />
          <input
            type="number"
            placeholder="To"
            value={quantityTo}
            onChange={(e) => setQuantityTo(e.target.value)}
            className="border px-2 py-1 rounded text-xs w-1/2"
          />
        </div>
      </th>

      {/* UPC Filter */}
      <th className="p-2">
        <div className="flex flex-col gap-1">
          <select
            value={upcMatchType}
            onChange={(e) => setUpcMatchType(e.target.value as MatchType)}
            className="border px-1 py-1 rounded text-xs w-full"
          >
            <option value="startsWith">Starts With</option>
            <option value="equals">Equals</option>
            <option value="contains">Contains</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="border px-2 py-1 rounded text-xs w-full"
            value={upcFilter}
            onChange={(e) => setUpcFilter(e.target.value)}
          />
        </div>
      </th>

      {/* ASIN Filter */}
      <th className="p-2">
        <div className="flex flex-col gap-1">
          <select
            value={asinMatchType}
            onChange={(e) => setAsinMatchType(e.target.value as MatchType)}
            className="border px-1 py-1 rounded text-xs w-full"
          >
            <option value="startsWith">Starts With</option>
            <option value="equals">Equals</option>
            <option value="contains">Contains</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="border px-2 py-1 rounded text-xs w-full"
            value={asinFilter}
            onChange={(e) => setAsinFilter(e.target.value)}
          />
        </div>
      </th>

      {/* Description Filter */}
      <th className="p-2">
        <div className="flex flex-col gap-1">
          <select
            value={descriptionMatchType}
            onChange={(e) => setDescriptionMatchType(e.target.value as MatchType)}
            className="border px-1 py-1 rounded text-xs w-full"
          >
            <option value="contains">Contains</option>
            <option value="startsWith">Starts With</option>
            <option value="equals">Equals</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="border px-2 py-1 rounded text-xs w-full"
            value={descriptionFilter}
            onChange={(e) => setDescriptionFilter(e.target.value)}
          />
        </div>
      </th>

      <th className="p-2"></th>
    </tr>
  );
}
