import React, { useState } from "react";
import { fetchKaggleDatasets } from "../api/kaggle";

export default function KaggleDatasetSearch() {
  const [query, setQuery] = useState("");
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await fetchKaggleDatasets(query);
      setDatasets(data);
    } catch (err) {
      setError("Erro ao buscar datasets do Kaggle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">Buscar Datasets do Kaggle</h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ex: hair, hair color, gray hair, hair type"
          className="flex-1 border rounded px-2 py-1"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded" disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <ul className="space-y-2">
        {datasets && datasets.length > 0 ? (
          datasets.map((ds, idx) => (
            <li key={ds.ref || idx} className="border p-2 rounded">
              <div className="font-semibold">{ds.title || ds.ref}</div>
              <div className="text-sm text-gray-600">{ds.subtitle || ds.description}</div>
              <a href={`https://www.kaggle.com/datasets/${ds.ref}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline text-xs">Ver no Kaggle</a>
            </li>
          ))
        ) : (
          <li className="text-gray-500">Nenhum dataset encontrado.</li>
        )}
      </ul>
    </div>
  );
}
