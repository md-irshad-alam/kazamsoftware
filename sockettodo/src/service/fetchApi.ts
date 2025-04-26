export async function fetchNotesAPI() {
  try {
    const res = await fetch(`https://kazamsoftware.onrender.com/getAll`);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // rethrow so caller can handle it
  }
}
