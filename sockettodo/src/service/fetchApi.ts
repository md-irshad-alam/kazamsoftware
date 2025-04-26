interface Notes {
  page: number;
  setLoading: (loading: boolean) => void;
  setNotes: (notes: any) => void;
}
export const fetchNotes = async ({ page, setLoading, setNotes }: Notes) => {
  setLoading(true);
  try {
    const res = await fetch(
      `http://localhost:4000/getAll?page=${page}&limit=10` // Corrected the query string
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
