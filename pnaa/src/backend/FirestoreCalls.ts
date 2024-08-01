import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDocsFromCache,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Event } from "../types/EventType";
import { Fundraising } from "../types/FundraisingType";
import { User } from "../types/UserType";

let chapters: { [key: string]: string[] } = {};

export const getChapters = async () => {
  if (Object.keys(chapters).length === 0) {
    await getChapterData();
  }
  const chapterNames: string[] = [];
  Object.keys(chapters).forEach((region) => {
    chapterNames.push(...chapters[region]);
  });
  return chapterNames;
};

export const getRegions = async () => {
  if (Object.keys(chapters).length === 0) {
    await getChapterData();
  }
  return Object.keys(chapters);
};

export const getChapterRegionData = async () => {
  if (Object.keys(chapters).length === 0) {
    await getChapterData();
  }
  return chapters;
};

export function getChapterData(): Promise<any[]> {
  const collectionRef = collection(db, "chapters");
  return new Promise((resolve, reject) => {
    getDocsFromCache(collectionRef)
      .then((snapshot: any) => {
        const allDocuments: any[] = [];
        const chapterRegions: { [key: string]: string[] } = {};
        chapterRegions["National"] = ["National"];
        snapshot.docs.map((doc: any) => {
          const document = doc.data();
          const newChapter = { ...document, id: doc.id };
          if (!chapterRegions[document.region]) {
            chapterRegions[document.region] = [document.name];
          } else {
            chapterRegions[document.region].push(document.name);
          }
          allDocuments.push(newChapter);
        });
        if (allDocuments.length == 0) {
          getDocs(collectionRef)
            .then((snapshot: any) => {
              const otherDocuments: any = [];
              snapshot.docs.map((doc: any) => {
                const document = doc.data();
                const newChapter = { ...document, id: doc.id };
                if (!chapterRegions[document.region]) {
                  chapterRegions[document.region] = [document.name];
                } else {
                  chapterRegions[document.region].push(document.name);
                }
                otherDocuments.push(newChapter);
              });
              chapters = { ...chapterRegions };
              resolve(otherDocuments);
            })
            .catch((error: any) => {
              reject(error);
            });
        } else {
          chapters = { ...chapterRegions };
          resolve(allDocuments);
        }
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function getDashboardData() {}

export function getEventsData(): Promise<{ event: Event; id: string }[]> {
  const collectionRef = collection(db, "events");
  return new Promise((resolve, reject) => {
    getDocs(collectionRef)
      .then((snapshot: any) => {
        const allDocuments: { event: Event; id: string }[] = [];
        const documents = snapshot.docs.map((doc: any) => {
          const document = doc.data();
          const newEvent = { event: document, id: doc.id };
          allDocuments.push(newEvent);
        });
        resolve(allDocuments);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function getFundraisingData(): Promise<
  { fundraising: Fundraising; id: string }[]
> {
  const collectionRef = collection(db, "fundraisers");
  return new Promise((resolve, reject) => {
    getDocs(collectionRef)
      .then((snapshot: any) => {
        const allDocuments: { fundraising: Fundraising; id: string }[] = [];
        const documents = snapshot.docs.map((doc: any) => {
          const document = doc.data();
          const newFundraiser = { fundraising: document, id: doc.id };
          allDocuments.push(newFundraiser);
        });
        resolve(allDocuments);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function getUsersData(): Promise<{ user: User; id: string }[]> {
  const collectionRef = collection(db, "users");
  return new Promise((resolve, reject) => {
    getDocs(collectionRef)
      .then((snapshot: any) => {
        const allDocuments: { user: User; id: string }[] = [];
        const documents = snapshot.docs.map((doc: any) => {
          const document = doc.data();
          const newUser = { user: document, id: doc.id };
          allDocuments.push(newUser);
        });
        resolve(allDocuments);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function getUserById(id: string): Promise<any[]> {
  const collectionRef = query(
    collection(db, "users"),
    /* Toss in conditions here*/
    where("auth_id", "==", id)
  );
  return new Promise((resolve, reject) => {
    getDocs(collectionRef)
      .then((snapshot: any) => {
        const allDocuments: any = [];
        const documents = snapshot.docs.map((doc: any) => {
          const document = doc.data();
          const newStudent = { ...document, id: doc.id };
          allDocuments.push(newStudent);
        });
        resolve(allDocuments);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function updateUser(user: Partial<User>, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === "" || !id) {
      reject(new Error("Invalid id"));
      return;
    }
    const collectionRef = doc(db, "users", id);
    updateDoc(collectionRef, { name: user.name, chapterName: user.chapterName })
      .then(() => {
        resolve();
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function filteredGetter(): Promise<any[]> {
  // Add collectionName here
  const collectionName = "";
  const collectionRef = query(
    collection(db, collectionName),
    /* Toss in conditions here*/
    where("type", "!=", "ADMIN")
  );
  return new Promise((resolve, reject) => {
    getDocs(collectionRef)
      .then((snapshot: any) => {
        const allDocuments: any = [];
        const documents = snapshot.docs.map((doc: any) => {
          const document = doc.data();
          const newStudent = { ...document, id: doc.id };
          allDocuments.push(newStudent);
        });
        resolve(allDocuments);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function basicSetter(docToAdd: any): Promise<any> {
  return new Promise((resolve, reject) => {
    // Add collectionName here
    const collectionName = "";
    addDoc(collection(db, collectionName), docToAdd)
      .then((docRef: any) => {
        // return id of document added
        resolve(docRef.id);
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function basicDeleter(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Add collectionName here
    const collectionName = "";
    deleteDoc(doc(db, collectionName, id))
      .then(() => {
        resolve();
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}

export function basicUpdater(newDocument: any, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (id === "" || !id) {
      reject(new Error("Invalid id"));
      return;
    }
    /* Add collection name here */
    const collectionName = "";
    const collectionRef = doc(db, collectionName, id);
    updateDoc(collectionRef, { ...newDocument })
      .then(() => {
        resolve();
      })
      .catch((error: any) => {
        reject(error);
      });
  });
}
