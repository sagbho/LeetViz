"use client";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Header from "./components/header";
import React from "react";
import { LoginModal } from "./components/login-modal";

export default function Home() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [slides, setSlides] = useState<React.ReactElement[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [programmingLanguage, setProgrammingLanguage] = useState("");
  const [slidesPerPage] = useState(1);

  // Controlled Input
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText((event.target as HTMLInputElement).value);
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setProgrammingLanguage(event.target.value);
  };

  const { isSignedIn: isAuthenticated } = useUser();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (text.length <= 0) {
      alert("Please enter a question");
      return;
    }

    setLoading(true);

    const leetcodeQuestion = text;
    const selectedLanguage = programmingLanguage;

    const customQuery = `I want to create a new slide with the following content: ${leetcodeQuestion} question in ${selectedLanguage}.`;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: customQuery,
        headers: { "Content-Type": "text/plain" },
      });

      const responseText = await res.text();

      const regex = /<div className="slide">([\s\S]*?)<\/div>/g;
      const slideContents: React.ReactElement[] = [];
      let match;
      while ((match = regex.exec(responseText)) !== null) {
        // The content inside each <div>...</div>
        const content = match[1];
        console.log("slide content:", content);
        // Convert HTML string to React element
        slideContents.push(
          <div
            key={slideContents.length}
            className="text-black text-left"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        );
      }

      setSlides(slideContents);
      setText("");
      setTitle(leetcodeQuestion);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating the slide.");
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const indexOfLastSlide = currentPage * slidesPerPage;
  const indexOfFirstSlide = indexOfLastSlide - slidesPerPage;
  const currentSlides = slides.slice(indexOfFirstSlide, indexOfLastSlide);

  const totalPages = Math.ceil(slides.length / slidesPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
          <div className="flex flex-col items-center text-center gap-x-2 relative">
            <Link href="/">
              <h1 className="text-3xl tracking-tighter font-bold">LeetViz</h1>
            </Link>
            <h2 className="text-xl tracking-tighter font-semibold text-amber-600 pb-6">
              Visualize and analyze leetcode questions
            </h2>
          </div>
          <main className="flex flex-col gap-8 items-center">
            <div className="flex flex-col gap-4 items-center text-center justify-center bg-white w-[300px] h-[400px] lg:w-[900px] lg:h-[500px] md:w-[600px] md:h-[400px] rounded-xl relative">
              <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
              />
              {currentSlides.length === 0 && (
                <>
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
                        value={programmingLanguage}
                        id="language"
                        onChange={handleLanguageChange}
                        className="rounded-xl focus:outline-none"
                      >
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="c++">C++</option>
                      </select>
                    </div>
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
                </>
              )}
              {currentSlides.length > 0 && (
                <>
                  {loading ? (
                    "Loading..."
                  ) : (
                    <>
                      <div className="flex items-center p-4">
                        {currentSlides}
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-center text-center absolute top-0 end-0 p-4 gap-x-2">
                    <span className="text-black font-light tracking-tighter text-sm">
                      {title}
                    </span>
                  </div>
                  <div className="flex items-center justify-center bg-slate-200 w-[100%] h-[60px] bottom-0 rounded-b-xl absolute ">
                    <div className="flex gap-x-4 items-center">
                      <button
                        className="bg-slate-300 hover:bg-slate-400 text-white rounded-xl p-2"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                      >
                        <ArrowLeftIcon className="text-black" />
                      </button>
                      <span className="font-semibold text-black">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        className="bg-slate-300 hover:bg-slate-400 text-white rounded-xl p-2"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                      >
                        <ArrowRightIcon className="text-black" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="pb-24">
              <form
                onSubmit={handleSubmit}
                className="flex flex-row relative w-[300px] lg:w-[400px] items-center"
              >
                <input
                  className="flex items-center rounded-full p-4 w-[100%] focus:outline-none caret-black tracking-tighter text-black"
                  type="text"
                  placeholder="Enter Leetcode question..."
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

          <footer className="flex flex-col gap-1 flex-wrap items-center justify-center">
            <div className="flex flex-row items-center justify-center text-center bg-amber-500 rounded-xl p-2 m-2 w-[300px] h-[50px]">
              <h1 className="text-xl text-black font-bold">
                Status: In Development
              </h1>
            </div>
            <div className="flex gap-1 flex-wrap items-center justify-center">
              &copy; 2024
              <Link
                href={"https://www.linkedin.com/in/sagar-bhola"}
                className="font-semibold"
                target="_blank"
              >
                LeetViz.
              </Link>
              All rights reserved.
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
