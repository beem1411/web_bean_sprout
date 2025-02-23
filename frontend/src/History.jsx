import React, { useState, useEffect } from "react";
import axios from "axios";
import "./History.css";

const History = () => {
  const [data, setData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("1");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [filteredData, setFilteredData] = useState([]);
  const [totalYield, setTotalYield] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dataFound, setDataFound] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/history"); // API ที่เรียง startDate ไว้แล้ว
      console.log("Fetched data:", response.data);
      setData(response.data); 
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const monthYearData = data.filter((item) => {
      const itemDate = new Date(item.startDate);
      return itemDate.getMonth() + 1 === parseInt(selectedMonth) &&
             itemDate.getFullYear() === parseInt(selectedYear);
    });

    setFilteredData(monthYearData);
    setDataFound(monthYearData.length > 0);

    const total = monthYearData.reduce((sum, item) => sum + (Number(item.amountEnd) || 0), 0);
    setTotalYield(total);
  }, [data, selectedMonth, selectedYear]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatWeight = (weight) => {
    return `${(weight ?? 0).toFixed(2)} กิโลกรัม`;
  };

  return (
    <div className="history-container">
      <h1>ประวัติการปลูก</h1>
      <div className="filter-container">
        <div className="filter-item">
          <label>เลือกเดือน : </label>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            {[...Array(12)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString("th-TH", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>เลือกปี : </label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            {[...Array(5)].map((_, index) => {
              const year = new Date().getFullYear() - index;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {loading ? (
        <p>กำลังโหลดข้อมูล...</p>
      ) : (
        <>
          <div className="table-container" style={{ width: "90%", margin: "0 auto" }}>
            <table border="1" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>วัน-เดือน-ปี (เริ่มปลูก)</th>
                  <th>เมล็ดที่ปลูก (กิโลกรัม)</th>
                  <th>ผลผลิตที่ได้ (กิโลกรัม)</th>
                </tr>
              </thead>
              <tbody>
                {dataFound ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>{formatDate(item.startDate)}</td>
                      <td>{formatWeight(item.amountStart)}</td>
                      <td>{formatWeight(item.amountEnd)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="average-container">
            <h3>ผลผลิตรวมของเดือนนี้ : {formatWeight(totalYield)}</h3>
          </div>
        </>
      )}
    </div>
  );
};

export default History;
