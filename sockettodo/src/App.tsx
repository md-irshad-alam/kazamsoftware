import { useEffect, useRef, useState } from "react";
import { fetchNotes } from "./service/fetchApi";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("https://kazamsoftware.onrender.com");
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
  const fetchNotes = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://kazamsoftware.onrender.com/getAll?page=${page}&limit=10` // Corrected the query string
      );
      const data = await res.json();

      // Prepend new notes to the existing ones to keep the latest on top
      setNotes((prev: any) => [...data?.data, ...prev]); // Prepend new notes to the front
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
  const handleAddNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newNote.trim()) {
      // Removed e.key check to allow adding notes on button click
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
    fetchNotes(page);
  }, [page]);

  return (
    <div className="w-full  bg-white absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
      <div className="lg:w-[30vw] sm:w-[100%] mx-auto  rounded-lg shadow-md overflow-hidden">
        {/* App Header */}
        <div className="bg-gray-100 p-4 flex items-center justify-center gap-x-2">
          <h1 className="text-black text-2xl font-bold">Note App</h1>
        </div>

        {/* Add Note Section */}
        <div className="border-gray-300  shadow-sm rounded-b-2xl-lg   p-4">
          <div className="flex items-center justify-between gap-x-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note..."
              className="px-3 w-full py-2 text-black border-gray-300 outline-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />

            <button
              onClick={(e: any) => handleAddNote(e)}
              onKeyDown={(e: any) => handleAddNote(e)}
              className="flex gap-x-2 items-center transition bg-[#92400E] hover:bg-[#92400E] text-white font-semibold py-2 px-4 rounded"
              disabled={!newNote.trim()}
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
          <h2 className="text-lg font-semibold text-black mb-3 text-left">
            Notes
          </h2>
          <ul
            className="space-y-2 overflow-auto max-h-[40vh] custom-scroll" // fixed max-height and overflow-auto
            onScroll={handleScroll}
            ref={listRef}
          >
            {notes?.map((note, index: number) => (
              <>
                <li
                  key={index}
                  className="p-3 text-black bg-gray-50  hover:bg-gray-100 cursor-pointer transition border-b-1 text-left"
                >
                  {note?.content}
                </li>
                {loading && (
                  <li
                    key={index}
                    className="p-3 bg-gray-50 text-black rounded hover:bg-gray-400 cursor-pointer transition border-b-1 text-center text-3xl"
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
