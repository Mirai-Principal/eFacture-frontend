import React, { useEffect, useRef, useState } from "react";
import "chart.js/auto";
import { Chart } from "react-chartjs-2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type Props = {};

function PrediccionGastos({}: Props) {
  const datos = {
    Usuario: {
      "72": 202519914,
      "73": 202519914,
      "74": 202519914,
      "75": 202519914,
      "76": 202519914,
      "77": 202519914,
      "78": 202519914,
      "79": 202519914,
      "80": 202519914,
      "81": 202519914,
      "82": 202519914,
      "83": 202519914,
    },
    Categoria: {
      "72": "Alimentos",
      "73": "Alimentos",
      "74": "Alimentos",
      "75": "Alimentos",
      "76": "Alimentos",
      "77": "Alimentos",
      "78": "Alimentos",
      "79": "Alimentos",
      "80": "Alimentos",
      "81": "Alimentos",
      "82": "Alimentos",
      "83": "Alimentos",
    },
    Anio: {
      "72": 2026,
      "73": 2026,
      "74": 2026,
      "75": 2026,
      "76": 2026,
      "77": 2026,
      "78": 2026,
      "79": 2026,
      "80": 2026,
      "81": 2026,
      "82": 2026,
      "83": 2026,
    },
    Mes: {
      "72": 12,
      "73": 1,
      "74": 2,
      "75": 3,
      "76": 4,
      "77": 5,
      "78": 6,
      "79": 7,
      "80": 8,
      "81": 9,
      "82": 10,
      "83": 11,
    },
    Anioo_Mes: {
      "72": "2026-12",
      "73": "2026-01",
      "74": "2026-02",
      "75": "2026-03",
      "76": "2026-04",
      "77": "2026-05",
      "78": "2026-06",
      "79": "2026-07",
      "80": "2026-08",
      "81": "2026-09",
      "82": "2026-10",
      "83": "2026-11",
    },
    Monto_predicho: {
      "72": 221.637615806,
      "73": 226.2830637886,
      "74": 234.7368289369,
      "75": 165.8541428724,
      "76": 185.4130499669,
      "77": 234.4899878083,
      "78": 261.7210826433,
      "79": 197.7394655256,
      "80": 216.1252702143,
      "81": 240.2396551417,
      "82": 224.5906490504,
      "83": 252.1381210878,
    },
  };
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const data = {
    labels: [
      "2025-01",
      "2025-02",
      "2025-03",
      "2025-04",
      "2025-05",
      "2025-06",
      "2025-07",
      "2025-08",
      "2025-09",
    ],
    datasets: [
      {
        label: "Monto Predicho",
        data: [9, 11, 5, 3, 6, 2, 7, 9, 5],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };
  return (
    <>
      <Navbar />
      <Chart type="bar" data={data} />
      <Footer />
    </>
  );
}

export default PrediccionGastos;
