import { ObjectId } from "mongodb";
import { mongoUrl } from "/lib/mongodb";

export async function PUT(request, { params }) {
  try {
    const db = await mongoUrl();
    const { id } = params;

    if (!id) {
      return Response.json(
        { success: false, message: "Blog ID is required" },
        { status: 400 }
      );
    }

    // views count ১ করে বাড়ানো হচ্ছে
    const updatedBlog = await db.collection("blogs").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } },
      { returnDocument: "after" }
    );

    if (!updatedBlog.value) {
      return Response.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "View count updated",
      views: updatedBlog.value.views,
    });
  } catch (error) {
    console.error("Error updating view count:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
