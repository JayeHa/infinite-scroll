function App() {
  const fetchUsers = async () => {
    const response = await fetch("/users", { method: "GET" });
    const data = await response.json();
    console.log(data);
  };

  fetchUsers();

  return <div className="App">App</div>;
}

export default App;
