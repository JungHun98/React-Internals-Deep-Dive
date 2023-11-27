import { useEffect, useState } from "react";

function App() {
  const [count, setCount] = useState(1);
  debugger;

  useEffect(() => {
    debugger;

    setCount((count) => count + 1);
  }, []);

  return <button>{count}</button>;
}

export default App;
