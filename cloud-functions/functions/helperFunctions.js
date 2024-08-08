module.exports = {
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
          startDate: startDate,
          endDate: endDate,
          startTime: "",
          endTime: "",
          location: event.Location,
          chapter: "National",
          region: "National",
          about: "",
          eventPoster: { name: "", ref: "", downloadURL: "" },
          attendees: 0,
          volunteers: 0,
          participantsServed: 0,
          contactHours: 0,
          volunteerHours: 0,
          otherDetails: 0,
          archived: false,
          lastUpdated: new Date(),
          creationDate: new Date(),
          lastUpdatedUser: "WildApricot",
        };
      }
    });
    return cleanedData;
  },
  processEventData: function (data) {
    // Convert the sorted array back into an object with event IDs as keys
    let processedData = {};
    for (const [key, value] of Object.entries(data)) {
      processedData[key] = value;
    }
    return processedData;
  },
  storeEventData: async function (db, eventData) {
    const tempDataCollection = db.collection("events");
    const snapshot = await tempDataCollection.get();

    const eventIDS = {};
    snapshot.forEach((doc) => {
      eventIDS[doc.id] = true;
    });

    const batch = db.batch();

    Object.entries(eventData).forEach(([key, data], index) => {
      const safeKey = key.replace(/\//g, "_");
      if (!eventIDS[safeKey]) {
        // add uncatalogued events
        const docRef = tempDataCollection.doc(safeKey); // Use chapter name or a unique key as the document ID
        batch.set(docRef, data, { merge: true });
      }
    });

    await batch.commit();
    console.log("Processed data stored successfully.");
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
  processMembershipData: async function (db, data) {
    const tempDataCollection = db.collection("chapters");
    const snapshot = await tempDataCollection.get();
    const chapterInfo = {};
    snapshot.forEach((doc) => {
      chapterInfo[doc.id] = doc.data();
    });

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
        const safeKey = chapter.replace(/\//g, "_");
        if (!chapterInfo[safeKey]) {
          chapterInfo[safeKey] = {
            name: chapter,
            totalActive: 0,
            totalLapsed: 0,
            region: regionValue,
            members: [],
          };
        }
        const index = chapterInfo[safeKey].members.findIndex(
          (member) => member.memberId === memberInfo.memberId
        );

        if (index == -1) {
          chapterInfo[safeKey].members.push(memberInfo);
        } else {
          chapterInfo[safeKey].members[index] = memberInfo;
        }
      }
    });
    return chapterInfo;
  },
  processWeeklyMembershipData: async function (db, data) {
    const chapterInfo = {};
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
        const safeKey = chapter.replace(/\//g, "_");
        if (!chapterInfo[safeKey]) {
          chapterInfo[safeKey] = {
            name: chapter,
            totalActive: 0,
            totalLapsed: 0,
            region: regionValue,
            members: [],
          };
        }

        chapterInfo[safeKey].members.push(memberInfo);
      }
    });
    return chapterInfo;
  },
  storeProcessedData: async function (db, processedData) {
    const finishedProcess = await processedData;
    const tempDataCollection = db.collection("chapters");
    const batch = db.batch();
    Object.entries(finishedProcess).forEach(([key, data], index) => {
      const docRef = tempDataCollection.doc(key); // Use chapter name or a unique key as the document ID
      batch.set(docRef, data);
    });

    await batch.commit();
    console.log("Processed data stored successfully.");
  },
};
