import { useState } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import jsPDF from "jspdf";
import { FaCopy, FaTrash, FaDownload } from "react-icons/fa";
import "./App.css";

function App() {

  const [code, setCode] = useState(`function sum(a,b){
    return a+b;
}`);

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  async function reviewCode() {

    setLoading(true);

    try {

      const API_URL = import.meta.env.DEV ? "http://localhost:3000" : "";

      const response = await axios.post(
        `${API_URL}/ai/get-review`,
        { code }
      );

      setReview(response.data);

    } catch (error) {

      console.log(error);
      setReview("Server Error");

    }

    setLoading(false);
  }

  function copyReview() {

    navigator.clipboard.writeText(review);
    alert("Review copied successfully.");

  }

  function clearEditor() {

    setCode("");
    setReview("");

  }

  function downloadPDF() {

    const doc = new jsPDF();

    const lines = doc.splitTextToSize(review, 180);

    doc.text(lines, 10, 10);

    doc.save("AI_Code_Review.pdf");

  }

  return (

    <>

      <header className="navbar">

        <h2>🤖 AI Code Reviewer</h2>

      </header>

      <main>

        {/* LEFT PANEL */}

        <div className="left">

          <div className="code">

            <Editor

              value={code}

              onValueChange={code => setCode(code)}

              highlight={code =>
                prism.highlight(
                  code,
                  prism.languages.javascript,
                  "javascript"
                )
              }

              padding={15}

              style={{

                fontFamily: '"Fira Code", monospace',
                fontSize: 16,
                height: "100%",
                width: "100%",
                background: "#111827",
                color: "white"

              }}

            />

          </div>

          <div className="bottomButtons">

            <button
              className="clearBtn"
              onClick={clearEditor}
            >
              <FaTrash /> Clear
            </button>

            <button
              className="review"
              onClick={reviewCode}
            >
              {loading ? "Reviewing..." : "Review"}
            </button>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="right">

          {/* Fixed Buttons */}

          <div className="topButtons">

            <button onClick={copyReview}>

              <FaCopy /> Copy

            </button>

            <button onClick={downloadPDF}>

              <FaDownload /> PDF

            </button>

          </div>

          {/* Only this section scrolls */}

          <div className="reviewContent">

            <Markdown
              rehypePlugins={[rehypeHighlight]}
            >
              {review}
            </Markdown>

          </div>

        </div>

      </main>

    </>

  );

}

export default App;