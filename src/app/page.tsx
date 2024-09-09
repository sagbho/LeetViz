"use client";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import Link from "next/link";
import Header from "./components/header";
import React from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [inputPlaceholder, setInputPlaceholder] = useState("Ask anything...");
  const [slides, setSlides] = useState<React.ReactElement[]>([]);
  const [loading, setLoading] = useState(false);

  // Controlled Input
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText((event.target as HTMLInputElement).value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (text.length <= 0) {
      alert("Please enter a question");
      return;
    }

    setLoading(true);

    const input = document.getElementById("language") as HTMLInputElement;
    const leetcodeQuestion = text;
    const programmingLanguage = input.value;

    const customQuery = `I want to create a new slide with the following content: ${leetcodeQuestion} in ${programmingLanguage}.`;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: customQuery,
        headers: { "Content-Type": "text/plain" },
      });

      const data = await res.text();

      console.log(customQuery);
      document.getElementById("user-prompt")?.classList.add("hidden");
      document.getElementById("language-selector")?.classList.add("hidden");
      setInputPlaceholder("Ask a question to update this slide...");

      const styledData = data
        .replace(
          /<h1>/g,
          '<h1 className="text-2xl font-bold tracking-tighter text-black mb-2">'
        )
        .replace(/<p>/g, '<p className="text-base mb-2 text-black">');

      const slideElements = styledData.split("</div>").map((slide, index) => (
        <React.Fragment key={index}>
          <div
            className="p-4 text-black shadow-md rounded-lg mb-4"
            dangerouslySetInnerHTML={{ __html: slide + "</div>" }}
          />
        </React.Fragment>
      ));

      setSlides(slideElements);
      setText("");
      setTitle(leetcodeQuestion);
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating the slide.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="bg-amber-400 p-10 rounded-xl flex justify-center items-center text-center">
        <h1 className="text-black text-3xl">
          <span className="font-bold">Status: </span>In Development
        </h1>
      </div>
      <div className="flex flex-col items-center justify-items-center min-h-screen p-12 pb-12 gap-4 font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-col items-center text-center gap-x-2 relative">
          <Link href="/">
            <h1 className="text-3xl tracking-tighter font-bold">LeetViz</h1>
          </Link>
          <h2 className="text-xl tracking-tighter font-semibold text-amber-600">
            Visualize and analyze leetcode questions
          </h2>
        </div>
        <main className="flex flex-col gap-8 items-center p-8">
          <div className="flex flex-col gap-4 items-center text-center justify-center bg-white w-[900px] h-[500px] rounded-xl relative">
            <div className="absolute w-[900px] h-[500px] rounded-t-xl">
              {slides.length > 0 && (
                <>
                  {slides.map((slide, index) => (
                    <React.Fragment key={index}>{slide}</React.Fragment>
                  ))}
                </>
              )}
            </div>
            <div
              className="flex items-center justify-center text-center absolute top-0 start-0 p-4 gap-x-2"
              id="language-selector"
            >
              <label
                htmlFor="language"
                className="text-black font-semibold tracking-tighter"
              >
                Language:
              </label>

              <div className="relative font-[family-name:var(--font-geist-sans)] text-black font-semibold tracking-tighter focus:outline-none rounded-md border-amber-500 border-2 border-solid">
                <select
                  name="language"
                  id="language"
                  className="rounded-xl focus:outline-none"
                >
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="c++">C++</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-center text-center absolute top-0 end-0 p-4 gap-x-2">
              <span className="text-black font-light tracking-tighter text-sm">
                {title}
              </span>
            </div>
            <p
              className="flex text-gray-700 tracking-tighter items-center gap-x-2 font-semibold"
              id="user-prompt"
            >
              {loading ? (
                "Loading..."
              ) : (
                <>
                  Enter your question below
                  <ArrowDownIcon />
                </>
              )}
            </p>
            <div className="flex items-center justify-center bg-slate-200 absolute w-[900px] h-[75px] bottom-0 rounded-b-xl">
              <div className="flex gap-x-4 items-center">
                <button className="bg-slate-300 hover:bg-slate-400 text-white rounded-xl p-2">
                  <ArrowLeftIcon className="text-black" />
                </button>
                <span className="font-semibold text-black ">
                  1 / {slides.length}
                </span>
                <button className="bg-slate-300 hover:bg-slate-400 text-white rounded-xl p-2">
                  <ArrowRightIcon className="text-black" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-row relative w-[400px] items-center"
            >
              <input
                className="flex items-center rounded-full p-3 w-[100%] focus:outline-none caret-black tracking-tighter text-black"
                type="text"
                placeholder={inputPlaceholder}
                onChange={handleInput}
                value={text}
                id="questionInput"
              />
              <button
                className="bg-amber-600 hover:bg-amber-700  text-white font-bold p-3 rounded-full absolute flex right-1 items-center justify-center"
                type="submit"
              >
                <ArrowUpIcon />
              </button>
            </form>
          </div>
        </main>

        <footer className="flex gap-1 flex-wrap items-center justify-center mt-auto pb-3">
          &copy; 2024
          <Link
            href={"https://www.linkedin.com/in/sagar-bhola"}
            className="font-semibold"
            target="_blank"
          >
            LeetViz.
          </Link>
          All rights reserved.
        </footer>
      </div>
    </>
  );
}
