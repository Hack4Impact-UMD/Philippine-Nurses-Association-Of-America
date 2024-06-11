module.exports = {
  storeEventData: async function (db, eventData) {
    const tempDataCollection = db.collection("events");
    const batch = db.batch();

    Object.entries(eventData).forEach(([key, data], index) => {
      const safeKey = key.replace(/\//g, "_");
      const docRef = tempDataCollection.doc(safeKey); // Use chapter name or a unique key as the document ID
      batch.set(docRef, data, { merge: true });
    });

    await batch.commit();
    console.log("Processed data stored successfully.");
  },
  storeProcessedData: async function (db, processedData) {
    const tempDataCollection = db.collection("chapters");
    const batch = db.batch();

    Object.entries(processedData).forEach(([key, data], index) => {
      const safeKey = key.replace(/\//g, "_");
      const docRef = tempDataCollection.doc(safeKey); // Use chapter name or a unique key as the document ID
      batch.set(docRef, data);
    });

    await batch.commit();
    console.log("Processed data stored successfully.");
  },
  processMembershipData: function (data) {
    const chaptersData = {};

    data.forEach((contact) => {
      const chapterField = contact.FieldValues.find(
        (field) => field.FieldName === "Chapter (Active/Associate - 1 year)"
      );
      const renewalField = contact.FieldValues.find(
        (field) => field.FieldName === "Renewal due"
      );
      const educationField = contact.FieldValues.find(
        (field) => field.FieldName === "Highest Level of Education"
      );
      const memberIdField = contact.FieldValues.find(
        (field) => field.FieldName === "Member ID"
      );
      const regionField = contact.FieldValues.find(
        (field) => field.FieldName === "PNAA Region"
      );

      const currentDate = new Date(); // Get the current date
      const renewalDate = renewalField ? new Date(renewalField.Value) : null;
      const isActive = renewalDate ? renewalDate >= currentDate : false;
      const membershipLevel = contact.MembershipLevel
        ? contact.MembershipLevel.Name
        : "Unknown";
      const highestEducation =
        educationField && educationField.Value
          ? educationField.Value.Label
          : "Unknown";
      const memberId = memberIdField ? memberIdField.Value : "Unknown";
      const regionValue =
        regionField && regionField.Value ? regionField.Value.Label : "Unknown";

      const memberInfo = {
        name: `${contact.FirstName} ${contact.LastName}`,
        email: contact.Email,
        membershipLevel,
        activeStatus: isActive ? "Active" : "Lapsed",
        renewalDueDate: renewalDate
          ? renewalDate.toISOString().substring(0, 10)
          : "N/A",
        chapterName:
          chapterField && chapterField.Value && chapterField.Value.Label
            ? chapterField.Value.Label
            : "Unknown",
        highestEducation,
        memberId,
      };

      if (chapterField && chapterField.Value && chapterField.Value.Label) {
        const chapter = chapterField.Value.Label;

        // Initialize chapter object if not already present
        if (!chaptersData[chapter]) {
          chaptersData[chapter] = {
            name: chapter, // Add the chapter name field
            totalActive: 0,
            totalLapsed: 0,
            region: regionValue,
            members: [],
          };
        }

        // Increment counts based on active status
        if (isActive) {
          chaptersData[chapter].totalActive++;
        } else {
          chaptersData[chapter].totalLapsed++;
        }

        // Add member info to the combined list
        chaptersData[chapter].members.push(memberInfo);
      }
    });

    // console.log(JSON.stringify(chaptersData, null, 2));
    return chaptersData;
  },
  cleanData: function (data) {
    const filteredData = data.filter((entry) => {
      return (
        entry.hasOwnProperty("MembershipLevel") &&
        Object.keys(entry.MembershipLevel).length > 0
      );
    });

    const validMembers = filteredData.filter((entry) => {
      return (
        entry.MembershipLevel.hasOwnProperty("Id") &&
        entry.MembershipLevel.Id !== null &&
        entry.MembershipLevel.Id !== undefined &&
        entry.MembershipLevel.Id !== ""
      );
    });
    return validMembers;
  },
  cleanEventData: function (data) {
    // Transform the array into an object with event IDs as keys
    let cleanedData = {};
    data.forEach((event) => {
      // Ensure that event.Id exists and is not undefined
      if (event.Id) {
        const startDate = event.StartDate.split("T")[0]; // Extract date part
        const endDate = event.EndDate.split("T")[0]; // Extract date part
        cleanedData[event.Id] = {
          id: event.Id,
          name: event.Name,
          date: `${startDate} - ${endDate}`, // Concatenate start and end dates
          location: event.Location,
          status: "National",
        };
      }
    });
    return cleanedData;
  },
  processEventData: function (data) {
    // Convert the object back to an array for sorting
    const eventsArray = Object.values(data).sort((a, b) => {
      // Extract the start date from the date string
      const aStartDate = new Date(a.date.split(" - ")[0]);
      const bStartDate = new Date(b.date.split(" - ")[0]);
      return bStartDate - aStartDate; // Sort by descending order
    });
    // Keep the top 40 most recent events
    const topEvents = eventsArray.slice(0, 40);

    // Convert the sorted array back into an object with event IDs as keys
    let processedData = {};
    topEvents.forEach((event) => {
      processedData[event.id] = event;
    });
    return processedData;
  },
};
