import { useEffect, useState } from "react";
import { supabase } from "./services/supabase";

function App() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data } = await supabase.from("components").select("*");
    if (data) setData(data);
  }

  return (
    <div>
      <h1>Inventoria</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.name} - {item.available_quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
