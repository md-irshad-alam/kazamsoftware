import { useEffect, useRef, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { fetchNotesAPI } from "./service/fetchApi";

const socket = io("https://kazamsoftware.onrender.com");
function App() {
  interface Note {
    content: string;
    createdAt: number;
  }
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);

  const listRef = useRef<HTMLUListElement>(null);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const data = await fetchNotesAPI();
      setNotes((prev: any) => [...data?.data, ...prev]);
      if (data?.data.length === 0) {
        console.log("No more notes to load.");
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
      socket.emit("add", { content: newNote });
      setNewNote("");
      setNotes((prev) => [
        { content: newNote, createdAt: Date.now() },
        ...prev,
      ]);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="w-full bg-white absolute top-0 bottom-0 sm:bottom-0 left-0 right-0 flex items-center justify-center">
      <div className="lg:w-[30vw] sm:w-[80%] p-2 mx-auto rounded-lg shadow-md overflow-hidden">
        {/* App Header */}
        <div className="bg-gray-100 p-4 flex items-center justify-center gap-x-2">
          <h1 className="text-black text-3xl font-bold">Note App</h1>
        </div>

        {/* Add Note Section */}
        <div className="border-gray-300 shadow-sm rounded-b-2xl-lg p-4">
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
        <div className="p-4">
          <h2 className="text-lg font-semibold text-black mb-3 text-left">
            Notes
          </h2>
          <ul
            className="space-y-2 overflow-auto max-h-[50vh] custom-scroll"
            ref={listRef}
          >
            {loading
              ? // show loading skeletons if loading
                Array.from({ length: 3 }).map((_, index) => (
                  <li
                    key={index}
                    className="p-3 bg-gray-200 animate-pulse rounded-md"
                  >
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </li>
                ))
              : // show notes if not loading
                notes?.map((note, index: number) => (
                  <li
                    key={index}
                    className="p-3 text-black bg-gray-50 hover:bg-gray-100 cursor-pointer transition border-b-1 text-left"
                  >
                    {note?.content}
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
