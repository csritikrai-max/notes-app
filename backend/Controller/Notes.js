import express from "express";
import NoteDB from "../module/NotesDB.js";

const Router =express.Router();

// See the Notes
Router.get("/",async (req,res)=>{
    try {
        const GetAllNotes = await NoteDB.find();
        res.status(200).json({message:"Note Fetched Successfully",GetAllNotes});

    } catch (error) {
        console.log("Fetching failed",error);
        res.status(500).json({message:"Failed to fetch Data"});
    }
});
//Create Note
// POST — return the created note
Router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    const CreateNote = new NoteDB({ title, content });
    await CreateNote.save();
    res.status(200).json({ message: "Created successfully", note: CreateNote }); // ← add note
  } catch (error) {
    res.status(500).json({ message: "Failed to Create Data" });
  }
});

// PUT — return the updated note
Router.put("/:id", async (req, res) => {
  try {
    const { title, content } = req.body;
    const updateNote = await NoteDB.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true } // ← this returns the updated document
    );
    if (!updateNote) return res.json({ message: "Note not found" });
    res.status(200).json({ message: "Updated successfully", note: updateNote });
  } catch (error) {
    res.status(500).json({ message: "Failed to Updated Data" });
  }
});
//Delete the Notes
Router.delete("/:id", async (req, res) => {
  try {
    const deleteNotes = await NoteDB.findByIdAndDelete(req.params.id);
    if (!deleteNotes) return res.json({ message: "Note not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log("Deletion failed", error);
    res.status(500).json({ message: "Failed to Delete Data" });
  }
});

export default Router;