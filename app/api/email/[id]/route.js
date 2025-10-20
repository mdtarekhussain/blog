import { mongoUrl } from "/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const db = await mongoUrl();
    const collection = db.collection("subscribers");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Subscriber not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Subscriber deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete subscriber" }, { status: 500 });
  }
}
