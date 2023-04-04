import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [questionInput, setQuestionInput] = useState("");
  const [result, setResult] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ questions: questionInput.split(/\r?\n/) }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setQuestionInput("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>RFP Answering Tool</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h3>RFP Answering Tool</h3>
        <form onSubmit={onSubmit}>
          <textarea
            name="questions"
            placeholder="Enter RFP questions separated by new lines"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            rows={10}
          />
          <input type="submit" value="Generate answers" />
        </form>
        <div className={styles.result}>
          {result.map((answer, index) => (
            <div key={index} className={styles.answerContainer}>
              <div className={styles.question}>
                <strong>Q{index + 1}:</strong>
              </div>
              <div className={styles.answer}>{answer}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
