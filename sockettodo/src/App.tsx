import { useEffect, useRef, useState } from "react";

import "./App.css";
import { io } from "socket.io-client";
const socket = io("http://localhost:4000");
function App() {
  interface Note {
    content: string;
    createdAt: number; // Add createdAt property
  }
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLUListElement>(null);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4000/getAll?page=${page}&limit=10` // Corrected the query string
      );
      const data = await res.json();

      // Prepend new notes to the existing ones to keep the latest on top
      setNotes((prev) => [...data?.data, ...prev]); // Prepend new notes to the front
      console.log(data);

      if (data?.data.length === 0) {
        console.log("No more notes to load.");
        return;
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      socket.emit("add", { content: newNote });
      setNewNote("");
      setNotes((prev) => [
        { content: newNote, createdAt: Date.now() }, // Add new note to the front
        ...prev,
      ]);
    }
  };

  const handleScroll = () => {
    const container = listRef.current;
    if (!container || loading) return;

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setPage((prev) => prev + 1); // Load next page of notes
    }
  };

  useEffect(() => {
    fetchNotes(); // Fetch notes on page change
  }, [page]);

  return (
    <div className="w-full bg-gray-100 lg:p-8 sm:p-8">
      <div className="lg:w-[30vw] sm:w-[100%] mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* App Header */}
        <div className="bg-blue-600 p-4">
          <h1 className="text-white text-xl font-bold">Note App</h1>
        </div>

        {/* Add Note Section */}
        <div className="border-gray-300  shadow-sm rounded-b-2xl-lg  bg-red-300 p-4">
          <div className="flex items-center justify-between gap-x-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note..."
              className="px-3 w-full py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />

            <button
              onClick={handleAddNote}
              className="flex gap-x-2 items-center transition"
            >
              <span className=" ">
                <img src="./plus.png" alt="" width={50} height={50} />
              </span>
              ADD{" "}
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="p-4 ">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 text-left">
            Notes
          </h2>
          <ul
            className="space-y-2 overflow-auto max-h-[40vh]" // fixed max-height and overflow-auto
            onScroll={handleScroll}
            ref={listRef}
          >
            {notes?.map((note, index: number) => (
              <>
                <li
                  key={index}
                  className="p-3 bg-gray-50 rounded hover:bg-gray-400 cursor-pointer transition border-b-1 text-left"
                >
                  {note?.content}
                </li>
                {loading && (
                  <li
                    key={index}
                    className="p-3 bg-gray-50 rounded hover:bg-gray-400 cursor-pointer transition border-b-1 text-center text-3xl"
                  >
                    Loading...
                  </li>
                )}
              </>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
