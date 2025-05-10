export const deployedLink = "https://kazamsoftware.onrender.com";
export async function fetchNotesAPI(page: any) {
  try {
    const res = await fetch(
      `${deployedLink}/fetchAllTasks?page=${page}&limit=9`
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
