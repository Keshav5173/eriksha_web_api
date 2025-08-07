import { Eriksha } from "../models/e-riksha.models.js";

export const deleteAllDuplicateErikshas = async (req, res) => {
  try {
    //  Fetching all rikshas ka data
    const allRikshas = await Eriksha.find({});


    {/* filtering rikshas  with dlNumber or use any other data after fetching from government database */}

    const grouped = {};

    for (let riksha of allRikshas) {
      const ownerKey = riksha.dlNumber; 
      if (!grouped[ownerKey]) {
        grouped[ownerKey] = [riksha];
      } else {
        grouped[ownerKey].push(riksha);
      }
    }

    // delete e-riksha with dl number having 2 or more e-riksha 

    for (let owner in grouped) {
      const rikshaList = grouped[owner];

      if (rikshaList.length > 1) {
        // Keep the first one, delete the rest
        const idsToDelete = rikshaList.slice(1).map(r => r._id);
        const result = await Eriksha.deleteMany({ _id: { $in: idsToDelete } });
        totalDeleted += result.deletedCount;
      }
    }

    res.status(200).json({ message: "Removed E-Riksha with same owner." });

  } catch (err) {
    console.error("Error deleting E-Riksha Data:", err);
    res.status(500).json({ message: "Server error" });
  }
};
