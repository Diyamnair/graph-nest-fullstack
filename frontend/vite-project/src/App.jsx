import { useState, useEffect } from "react";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    setShowCard(true);
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/bfhl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: input.split(","),
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      alert("Error connecting to backend");
    }
  };

  return (
    <div style={styles.page}>
      <div
        style={{
          ...styles.card,
          opacity: showCard ? 1 : 0,
          transform: showCard ? "translateY(0)" : "translateY(40px)",
        }}
      >
        <h2 style={styles.title}>SRM Full Stack 🚀</h2>

        <textarea
          style={styles.textarea}
          placeholder="Enter like: A->B, A->C, B->D"
          onChange={(e) => setInput(e.target.value)}
        />

        <button style={styles.button} onClick={handleSubmit}>
          Submit
        </button>

        {response && (
          <div style={styles.output}>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    backgroundImage: "url('/bg.png')", // 👈 JUST THIS
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "420px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    textAlign: "center",
    transition: "all 0.6s ease",
  },
  title: {
    marginBottom: "15px",
    color: "black",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
    color: "black",
  },
  button: {
    background: "#1e3c72",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  output: {
    marginTop: "20px",
    textAlign: "left",
    maxHeight: "200px",
    overflowY: "auto",
    background: "#f4f4f4",
    padding: "10px",
    borderRadius: "8px",
    color: "black",
  },
};

export default App;