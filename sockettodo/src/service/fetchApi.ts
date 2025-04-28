export async function fetchNotesAPI(page: any) {
  try {
    //kazamsoftware.onre
    // coonder.com/getAll
    console.log(page);
    const res = await fetch(
      `https://kazamsoftware.onrender.com/api/getAll?page=${page}&limit=9`
    );

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
