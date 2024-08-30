import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState(null); // Изменено начальное состояние на null
  const [loading, setLoading] = useState(true); // Добавлен индикатор загрузки

  useEffect(() => {
    fetch("https://localhost:7097/api/Students/GetAll")
      .then((response) => response.json()) // Парсинг JSON
      .then((data) => {
        setData(data);
        setLoading(false); // Данные загружены
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Ошибка загрузки
      });
  }, []); // Добавлен пустой массив зависимостей

  if (loading) {
    return <div className="App">Loading...</div>; // Индикация загрузки
  }

  if (!data) {
    return <div className="App">No data available</div>; // Индикация отсутствия данных
  }

  return (
    <div className="App">
      {data.map((student) => (
        <div key={student.id}>
          {student.name} - {student.age}
        </div>
      ))}
    </div>
  );
}

export default App;
